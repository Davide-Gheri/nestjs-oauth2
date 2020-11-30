import React, { useCallback, useEffect } from 'react';
import { Grid, Button, TextField, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { useClientNewForm } from '../../hooks';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';

export const ClientNew: React.FC<{ onSubmit?: () => void }> = ({ onSubmit: onParentSubmit }) => {
  const { onSubmit, register, setValue, control, errors } = useClientNewForm();

  useEffect(() => {
    register('redirect');
  }, [register]);

  const onFormSubmit = useCallback(async (e: React.FormEvent) => {
    try {
      await onSubmit(e);
      if (onParentSubmit) {
        onParentSubmit();
      }
    } catch (e) {
      //
    }
  }, [onSubmit, onParentSubmit]);

  return (
    <div>
      <form noValidate onSubmit={onFormSubmit}>
        <Grid container spacing={3}>
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
            <Autocomplete
              freeSolo
              multiple
              onChange={(e: any, newVals: string[]) => setValue('redirect', newVals)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Redirect URIs"
                  required
                  size="small"
                  error={!!errors.redirect}
                  helperText={(errors.redirect as any)?.message}
                />
              )}
              options={[] as string[]}
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
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Controller
                    name="firstParty"
                    as={Switch}
                    control={control}
                    color="primary"
                  />
                }
                label="Is First Party"
              />
            </FormGroup>
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
    </div>
  )
}
