import React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useGuestStyles } from './styles';
import { useTfaForm } from '../../hooks';

export const TfaForm: React.FC<{ remember?: boolean }> = ({ remember = false }) => {
  const classes = useGuestStyles();
  const { onSubmit, register, errors, loading } = useTfaForm(remember);

  return (
    <form className={classes.form} onSubmit={onSubmit} noValidate>
      <Typography variant="h6">
        Insert the Time based Code from your two factor authentication app
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Code"
        autoFocus
        name="code"
        inputRef={register({ required: 'OTP Code required' })}
        error={!!errors.code}
        helperText={errors.code?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={loading}
      >
        Confirm
      </Button>
    </form>
  )
}
