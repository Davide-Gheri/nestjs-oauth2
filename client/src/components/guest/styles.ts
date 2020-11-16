import { makeStyles } from '@material-ui/core/styles';

export const useGuestStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  marginLeft: {
    marginLeft: 'auto',
  },
}));
