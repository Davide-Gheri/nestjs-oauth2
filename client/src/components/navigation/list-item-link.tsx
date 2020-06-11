import React, { forwardRef, useMemo } from 'react';
import { ListItem, ListItemProps } from '@material-ui/core';
import { Link } from 'react-router-dom';

export interface ListItemLinkProps extends ListItemProps {
  to: string | {
    state: any;
    pathname: string;
  };
  linkComponent?: React.ElementType;
}

export const ListItemLink = forwardRef<any, ListItemLinkProps>(({ to, children, linkComponent: LinkComponent = Link, ...props }, ref) => {
  const renderLink = useMemo(() => (
    forwardRef((itemProps, ref) => <LinkComponent to={to} ref={ref as any} {...itemProps}/>)
  ), [to]);

  return (
    <ListItem {...props} ref={ref} button component={renderLink as any}>
      {children}
    </ListItem>
  );
});

ListItemLink.displayName = 'ListItemLink';
