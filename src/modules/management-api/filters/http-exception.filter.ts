import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApolloError, toApolloError, UserInputError } from 'apollo-server-errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private httpApolloMap = new Map();

  constructor() {
    this.httpApolloMap.set(BadRequestException.name, UserInputError);
  }

  catch(exception: HttpException, host: ArgumentsHost): any {
    return this.toApollo(exception);
  }

  private toApollo(exception: HttpException) {
    const response: {
      message: string | string[];
      statusCode: number;
      error: string;
    } | string = exception.getResponse() as any;

    const message = typeof response == 'string' ? response : response.message;
    const error = typeof response === 'string' ? exception.name : response.error;

    const initOptions = [
      Array.isArray(message) ? message[0] : message || error,
      error,
    ];

    let err: ApolloError;
    if (this.httpApolloMap.has(exception.name)) {
      err = new (this.httpApolloMap.get(exception.name))(
        ...initOptions,
      );
    } else {
      err = new ApolloError(
        ...initOptions as [string, string],
      );
    }
    return err;
  }
}
