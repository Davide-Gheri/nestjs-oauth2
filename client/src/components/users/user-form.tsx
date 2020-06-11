import React from 'react';
import { Button, Grid, TextField, MenuItem } from '@material-ui/core';
import { FormContextValues, Controller } from 'react-hook-form';
import { Roles } from '../../generated/graphql';

export interface UserFormProps {
  register: FormContextValues['register'];
  errors: FormContextValues['errors'];
  watch: FormContextValues['watch'];
  onSubmit: (e: React.FormEvent) => void;
  control: FormContextValues['control'];
  loading: boolean;
  withPassword?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ register, errors, watch, onSubmit, loading, control, withPassword = false }) => {
  const validatePassword = (value: string) => value === watch('passwordConfirm') || 'Password does not match';

  return (
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Nickname"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="nickname"
            autoComplete="off"
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
            type="email"
            variant="outlined"
            size="small"
            name="email"
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
            inputRef={register}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        {withPassword && (
          <>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                required
                type="password"
                variant="outlined"
                size="small"
                name="password"
                autoComplete="off"
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
                label="Confirm Password"
                fullWidth
                required
                type="password"
                variant="outlined"
                size="small"
                name="passwordConfirm"
                autoComplete="off"
                inputRef={register({ required: 'Password confirm required' })}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Controller
            name="role"
            as={TextField}
            label="Role"
            fullWidth
            required
            variant="outlined"
            size="small"
            select
            control={control}
          >
            {Object.values(Roles).map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Controller>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
