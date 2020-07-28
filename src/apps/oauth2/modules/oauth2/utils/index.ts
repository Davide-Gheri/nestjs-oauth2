import { Response } from 'express';
import { ResponseModes } from '../constants';
import * as qs from 'querystring';
import { AuthRequest } from '../auth.request';

/**
 * Handle consent redirect, based on response_mode param
 * Available modes:
 * * query (default): return the params as querystring
 * * fragment: return the params as url fragment
 * * form_post: render an html form that auth submit with POST method to the redirect url
 * @param res
 * @param responseMode
 * @param returnTo
 * @param params
 */
export const handleResponseMode = (
  res: Response,
  responseMode: ResponseModes,
  returnTo: string,
  params: Record<string, any>,
) => {
  switch (responseMode) {
    case ResponseModes.query:
      return res.status(302).redirect(this.makeRedirectUri(returnTo, params));
    case ResponseModes.fragment:
      return res.status(302).redirect(this.makeRedirectUri(returnTo, undefined, params));
    case ResponseModes.form_post:
      return res.render('form_post', {
        returnTo,
        hiddenFields: params,
        layout: false,
      });
  }
}

export const makeRedirectUri = (uri: string, params?: Record<string, any>, hash?: Record<string, any>) => {
  const url = new URL(uri);
  if (params) {
    url.search = qs.stringify(params);
  }
  if (hash) {
    url.hash = qs.stringify(hash);
  }
  return url.toString();
}

export const getAuthRequestFromSession = (session: any): AuthRequest => {
  const authRequest = session.authRequest as AuthRequest;
  if (!authRequest) {
    throw new Error('Authorization request was not present in the session.');
  }
  delete session.authRequest;
  return authRequest;
}
