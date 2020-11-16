import React, { forwardRef } from 'react';
import { useAppCurrentUser } from '../../hooks';
import { Box, Avatar, Typography, BoxProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginBottom: theme.spacing(2),
  }
}));

export const UserProfile = forwardRef<any, BoxProps>((props, ref) => {
  const user = useAppCurrentUser();
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      {...props}
    >
      <Avatar src={user?.picture} className={classes.avatar}/>
      <Typography variant="h6" color="inherit">
        {user?.nickname}
      </Typography>
      <Typography variant="caption" color="inherit">
        {user?.email}
      </Typography>
    </Box>
  )
});
