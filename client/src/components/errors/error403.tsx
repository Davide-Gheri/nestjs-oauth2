import React from 'react';
import { BaseError } from './base-error';

export const Error403: React.FC<{ message?: string }> = ({ message = 'You don\'t have permissions to access this page' }) => {
  return (
    <BaseError message={message} code={403}/>
  )
}
