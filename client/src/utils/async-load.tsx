import React, { ComponentType, lazy } from 'react';
import { RouteComponentProps } from 'react-router';

export const asyncLoad = (factory: () => Promise<{ default: ComponentType<RouteComponentProps<any>> }>) => {
  const Comp = lazy(factory);
  return (props: RouteComponentProps<any>) => <Comp {...props}/>;
};
