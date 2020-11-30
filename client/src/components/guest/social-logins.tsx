import React from 'react';
import { Button, SvgIcon } from '@material-ui/core';
import { Facebook } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { ReactComponent as GoogleLogo } from '../../assets/google-logo.svg';
import { useAppData } from '../../hooks';

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: theme.spacing(1),
  },
  fbButton: {
    backgroundColor: '#4C69BA',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#4C69BA',
      color: theme.palette.common.white,
    }
  },
  gButton: {
    backgroundColor: '#4C8BF5',
    color: theme.palette.getContrastText('#4C8BF5'),
    '&:hover': {
      backgroundColor: '#4C8BF5',
      color: theme.palette.getContrastText('#4C8BF5'),
    }
  },
  gButtonLogo: {
    backgroundColor: theme.palette.common.white,
    padding: 3,
    borderRadius: '100%',
  },
}));

export const SocialLogins: React.FC = () => {
  const classes = useStyles();
  const { facebookLoginUrl, googleLoginUrl } = useAppData();

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        className={clsx(classes.button, classes.fbButton)}
        startIcon={<Facebook/>}
        onClick={() => {
          window.location.href = facebookLoginUrl;
        }}
      >
        Login with Facebook
      </Button>

      <Button
        variant="contained"
        fullWidth
        className={clsx(classes.button, classes.gButton)}
        startIcon={
          <SvgIcon className={classes.gButtonLogo}>
            <GoogleLogo/>
          </SvgIcon>
        }
        onClick={() => {
          window.location.href = googleLoginUrl;
        }}
      >
        Login with Google
      </Button>
    </>
  )
};
