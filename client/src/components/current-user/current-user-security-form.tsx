import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { useCurrentUserSecurityForm } from '../../hooks';

export const CurrentUserSecurityForm: React.FC = () => {
  const { register, onSubmit, errors, watch } = useCurrentUserSecurityForm();
  const validatePassword = (value: string) => value === watch('passwordConfirm') || 'Password does not match';

  return (
    <form noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="New password"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="password"
            type="password"
            inputRef={register({
              required: 'Password required',
              validate: validatePassword
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Retype new password"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="passwordConfirm"
            type="password"
            inputRef={register({ required: 'Password confirmation required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Current password"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="currentPassword"
            type="password"
            inputRef={register({ required: 'Current password required' })}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
