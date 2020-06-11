import React from 'react';
import { useAuthorize, useCsrf, useCurrentUser } from '../hooks';
import {
  Grid,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { useGuestStyles } from './guest/styles';

export const AuthorizeForm: React.FC = () => {
  const classes = useGuestStyles();
  const csrf = useCsrf();
  const { scopes, client, parsedScopes } = useAuthorize();
  const user = useCurrentUser();

  return (
    <>
      <Typography>
        Hi <strong>{user.nickname}</strong>, the app <strong>{client.name}</strong> is requesting access to the following permissions:
      </Typography>
      <form action="/oauth2/accept-consent" method="post" className={classes.form}>
        <input type="hidden" name="_csrf" defaultValue={csrf}/>
        <Paper>
          <List disablePadding>
            {parsedScopes.map(({ scope, label }, idx: number) =>
              label ? (
                <ListItem key={scope} dense divider={idx !== scopes.length -1}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      defaultChecked
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': scope }}
                      value={scope}
                      name="scopes[]"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    id={scope}
                  />
                </ListItem>
              ) : (
                <input type="hidden" name="scopes[]" defaultValue={scope}/>
              )
            )}
          </List>
        </Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Authorize
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              form="deny-form"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
            >
              Deny
            </Button>
          </Grid>
        </Grid>
      </form>
      <form action="/oauth2/deny-consent" method="post" id="deny-form">
        <input type="hidden" name="_csrf" defaultValue={csrf}/>
      </form>
    </>
  )
};
