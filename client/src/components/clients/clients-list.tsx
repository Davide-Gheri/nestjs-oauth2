import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, IconButton, Avatar } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { useClients } from '../../hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { getClientLogo } from '../../utils';
import { Error403 } from '../errors';

const useStyles = makeStyles(theme => ({
  listItem: {
    borderLeft: 'solid 4px transparent',
  },
  firstParty: {
    borderLeft: 'solid 4px',
    borderLeftColor: theme.palette.success.main,
  }
}));

export const ClientsList: React.FC = () => {
  const { clients, loading, error, errorCode } = useClients();
  const classes = useStyles();

  if (error && errorCode === 'FORBIDDEN') {
    return <Error403/>
  }

  return (
    <Box>
      <List disablePadding>
        {loading ? (
          [1, 2].map(k => (
            <ListItem divider key={k}>
              <ListItemAvatar>
                <Skeleton variant="circle"><Avatar/></Skeleton>
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="30%"/>}
                secondary={<Skeleton/>}
              />
            </ListItem>
          ))
        ) : (
          clients.length ? clients.map((client, idx) => (
            <ListItem
              key={client.id}
              divider={idx !== clients.length -1 }
              className={clsx(classes.listItem, { [classes.firstParty]: client.firstParty })}
            >
              <ListItemAvatar>{getClientLogo(client)}</ListItemAvatar>
              <ListItemText
                primary={client.name}
                secondary={client.id}
              />
              <ListItemSecondaryAction>
                <IconButton component={Link} to={`/app/clients/${client.id}`}>
                  <ChevronRight/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            )) : (
              <ListItem
                className={classes.listItem}
              >
                <ListItemText
                  primary="No clients found"
                />
              </ListItem>
          )
        )}
      </List>
    </Box>
  )
}
