import React from 'react';
import { BaseError } from './base-error';

export const Error404: React.FC<{ message?: string }> = ({ message = 'Page not found' }) => {
  return (
    <BaseError message={message} code={404}/>
  )
}
