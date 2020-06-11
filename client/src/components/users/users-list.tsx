import React from 'react';
import { useUsers } from '../../hooks';
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Error403 } from '../errors';

const useStyles = makeStyles(theme => ({
  listItem: {
    borderLeft: 'solid 4px transparent',
  },
  unverified: {
    borderLeft: 'solid 4px',
    borderLeftColor: theme.palette.error.light,
  },
}));

export const UsersList: React.FC = () => {
  const classes = useStyles();
  const { users, loading, errorCode, error } = useUsers();

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
                secondary={<Skeleton width="50%"/>}
              />
            </ListItem>
          ))
        ) : (
          users.map((user, idx) => (
            <ListItem
              key={user.id}
              divider={idx !== users.length -1 }
              className={clsx(classes.listItem, { [classes.unverified]: !user.emailVerifiedAt })}
            >
              <ListItemAvatar>
                <Avatar src={user.picture}/>
              </ListItemAvatar>
              <ListItemText
                primary={user.nickname}
                secondary={user.email}
              />
              <ListItemSecondaryAction>
                <IconButton component={Link} to={`/app/users/${user.id}`}>
                  <ChevronRight/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  )
}
