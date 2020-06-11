import { Avatar } from '@material-ui/core';
import React from 'react';

export const getClientLogo = (client: any) => {
  if (client.description?.logo_uri) {
    return <Avatar src={client.description.logo_uri}/>
  }
  return (
    <Avatar>
      {client.name[0].toUpperCase()}
    </Avatar>
  )
}
