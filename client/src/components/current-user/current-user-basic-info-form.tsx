import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { useCurrentUserBasicInfoForm } from '../../hooks';

export const CurrentUserBasicInfoForm: React.FC = () => {
  const { onSubmit, register, errors } = useCurrentUserBasicInfoForm()

  return (
    <form noValidate onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Nickname"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="nickname"
            inputRef={register({ required: 'Nickname required' })}
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="email"
            inputRef={register({ required: 'Email required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="First name"
            fullWidth
            variant="outlined"
            size="small"
            name="firstName"
            inputRef={register}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last name"
            fullWidth
            variant="outlined"
            size="small"
            name="lastName"
            inputRef={register}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
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
