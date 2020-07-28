import { Body, Controller, Get, Post, Query, Req, Res, Session, UseFilters, UseGuards } from '@nestjs/common';
import { AuthorizeDto, ConsentDto } from '../dto';
import { CodeService } from '../services';
import { CurrentUser } from '@app/modules/auth';
import { User } from '@app/entities';
import { Request, Response } from 'express';
import { PromptTypes } from '../constants';
import { AuthorizeForbiddenExceptionFilter } from '../filters/authorize-forbidden-exception.filter';
import { AuthorizeGuard, ClientAuthGuard, PkceGuard } from '../guards';
import { OAuthExceptionFilter, RFC6749ExceptionFilter } from '../filters';
import { getAuthRequestFromSession, handleResponseMode } from '@app/modules/oauth2/utils';

@UseFilters(RFC6749ExceptionFilter, AuthorizeForbiddenExceptionFilter, OAuthExceptionFilter)
@Controller('oauth2')
export class AuthorizeController {
  constructor(
    private readonly service: CodeService,
  ) {}

  /**
   * /oauth2/authorize endpoint
   * Start the authorization flow
   * @param query
   * @param user
   * @param session
   * @param req
   * @param res
   */
  @UseGuards(AuthorizeGuard, ClientAuthGuard(false), PkceGuard('challenge'))
  @Get('authorize')
  async showAuthorizeForm(
    @Query() query: AuthorizeDto,
    @CurrentUser() user: User,
    @Session() session: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    /**
     * Validate request parameters and generate a AuthRequest to be persisted in the session
     */
    const { authRequest, skip } = await this.service.validateAuthorizationRequest(query, user);
    if (skip) {
      /**
       * The user already granted the requested permissions and those permissions are not expired yet,
       * or the client is firstParty and doesn't need user consent.
       * Automatically generate the auth code and successfully redirect to the redirect_uri
       */
      const { returnTo, state, code } = await this.service.completeAuthorizationRequest(authRequest, user, true);
      return handleResponseMode(
        res,
        authRequest.responseMode,
        returnTo,
        { state, code },
      );
    } else if (query.prompt === PromptTypes.none) {
      /**
       * Consent cannot be skipped but the request does not permit user interaction
       * Redirect to the redirect_uri with an error
       */
      return handleResponseMode(
        res,
        query.response_mode,
        query.redirect_uri,
        {
          error: 'interaction_required',
          state: query.state,
        },
      );
    }
    /**
     * Consent cannot be skipped,
     * save the AuthRequest to the session and show the consent form
     */
    session.authRequest = authRequest;
    return res.render('index', {
      client: authRequest.client,
      user: user,
      scopes: authRequest.scopes,
      csrfToken: req.csrfToken(),
    });
  }

  /**
   * Handle successful consent form
   * @param session
   * @param user
   * @param data
   * @param res
   */
  @UseGuards(AuthorizeGuard)
  @Post('accept-consent')
  async acceptConsent(
    @Session() session: any,
    @CurrentUser() user: User,
    @Body() data: ConsentDto,
    @Res() res: Response,
  ) {
    /**
     * Retrieve the AuthRequest from the session
     */
    const authRequest = getAuthRequestFromSession(session);
    /**
     * A user can override the requested scopes, replace the user defined with the originally requested
     */
    authRequest.scopes = (data.scopes || []).filter(Boolean);
    /**
     * Generate the auth code and successfully redirect to the redirect_uri
     */
    const { returnTo, state, code } = await this.service.completeAuthorizationRequest(authRequest, user, true);
    return handleResponseMode(
      res,
      authRequest.responseMode,
      returnTo,
      { state, code },
    );
  }

  /**
   * Handle denied consent form
   * @param session
   * @param user
   * @param data
   * @param res
   */
  @UseGuards(AuthorizeGuard)
  @Post('deny-consent')
  async denyConsent(
    @Session() session: any,
    @CurrentUser() user: User,
    @Body() data: ConsentDto,
    @Res() res: Response,
  ) {
    /**
     * Retrieve the AuthRequest from the session
     */
    const authRequest = getAuthRequestFromSession(session);
    /**
     * Redirect to the redirect_uri with error
     */
    return handleResponseMode(
      res,
      authRequest.responseMode,
      authRequest.redirectUri,
      {
        error: 'access_denied',
        error_description: 'The user denied the request',
        state: authRequest.state,
      },
    )
  }
}
