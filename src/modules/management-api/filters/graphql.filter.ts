import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ApolloError } from 'apollo-server-errors';

@Catch(ApolloError)
export class GraphqlFilter implements ExceptionFilter<ApolloError> {
  catch(exception: ApolloError, host: ArgumentsHost): any {
    return exception;
  }
}
