import React, { useCallback, useState } from 'react';
import { Grid, TextField, IconButton, InputAdornment, Divider, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useClientBasicInfoForm } from '../../hooks';
import { ClientDataFragment } from '../../generated/graphql';

export const ClientBasicInfo: React.FC<{ client: ClientDataFragment }> = ({ client }) => {
  const [showSecret, setShowSecret] = useState(false);
  const { onSubmit, register, loading, errors } = useClientBasicInfoForm(client);

  const toggleShowSecret = useCallback(() => setShowSecret(o => !o), [setShowSecret]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Client ID"
            fullWidth
            defaultValue={client.id}
            variant="outlined"
            size="small"
            inputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client Secret"
            fullWidth
            defaultValue={client.secret}
            variant="outlined"
            size="small"
            type={showSecret ? 'text' : 'password'}
            inputProps={{
              readOnly: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={toggleShowSecret}>
                    {showSecret ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client Name"
            fullWidth
            required
            variant="outlined"
            size="small"
            name="name"
            inputRef={register({ required: 'Client name required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client Logo URL"
            fullWidth
            variant="outlined"
            size="small"
            name="meta.logo_uri"
            inputRef={register}
            error={!!errors.meta?.logo_uri}
            helperText={errors.meta?.logo_uri?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client Description"
            fullWidth
            variant="outlined"
            size="small"
            name="meta.description"
            multiline
            rows={4}
            inputRef={register}
            error={!!errors.meta?.description}
            helperText={errors.meta?.description?.message}
          />
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
