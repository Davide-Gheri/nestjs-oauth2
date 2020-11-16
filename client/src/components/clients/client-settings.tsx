import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClientDataFragment, TokenAuthMethod } from '../../generated/graphql';
import {
  Button,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  FormLabel,
  Switch,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useClientSettingsForm } from '../../hooks';
import { Controller } from 'react-hook-form';
import uniq from 'lodash/uniq';
import { authMethods, grantTypes, responseModes, responseTypes, openIDScopes } from '../../utils';

const setChecked = (setFn: (values: string[]) => void, currentValues: string[]) => (name: string) => {
  const newNames = (currentValues || []).includes(name)
    ? [...currentValues.filter(n => n !== name)]
    : [...(currentValues || []), name];
  setFn(newNames);
  return newNames;
}

export const ClientSettings: React.FC<{ client: ClientDataFragment }> = ({ client }) => {
  const { onSubmit, register, control, setValue } = useClientSettingsForm(client);

  const [checkedGts, setCheckedGts] = useState<string[]>(client.grantTypes || []);
  const [checkedRts, setCheckedRts] = useState<string[]>(client.responseTypes || []);
  const [checkedRms, setCheckedRms] = useState<string[]>(client.responseModes || []);
  const [checkedAms, setCheckedAms] = useState<string[]>(client.authMethods || []);

  const handleCheckGts = useCallback(setChecked(setCheckedGts, checkedGts), [checkedGts, setCheckedGts]);
  const handleCheckRts = useCallback(setChecked(setCheckedRts, checkedRts), [checkedRts, setCheckedRts]);
  const handleCheckRms = useCallback(setChecked(setCheckedRms, checkedRms), [checkedRms, setCheckedRms]);
  const handleCheckAms = useCallback((name: string) => {
    let newNames: string[];
    if (name === TokenAuthMethod.None) {
      newNames = checkedAms.includes(name)
        ? [...checkedAms.filter(n => n !== name)]
        : [name];
    } else {
      newNames = checkedAms.includes(name)
        ? [...checkedAms.filter(n => n !== name && n !== TokenAuthMethod.None)]
        : [...(checkedAms || []).filter(n => n !== TokenAuthMethod.None), name];
    }
    setCheckedAms(newNames);
    return newNames;
  }, [checkedAms, setCheckedAms]);

  const initialScopes = useMemo(() => uniq(openIDScopes.concat(client.scopes)), [client.scopes]);

  useEffect(() => {
    register('scopes');
    register('redirect');
  }, [register]);

  return (
    <form noValidate onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            multiple
            defaultValue={client.redirect}
            onChange={(e: any, newVals: string[]) => setValue('redirect', newVals)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Redirect URIs"
                size="small"
              />
            )}
            options={client.redirect}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            multiple
            defaultValue={client.scopes}
            onChange={(e: any, newVals: string[]) => setValue('scopes', newVals)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Scopes"
                size="small"
              />
            )}
            options={initialScopes}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Enabled Grant types</FormLabel>
            <FormGroup>
              {grantTypes.map(grant => (
                <FormControlLabel
                  key={grant.value}
                  control={
                    <Controller
                      name="grantTypes"
                      as={Checkbox}
                      color="primary"
                      control={control}
                      checked={checkedGts.includes(grant.value)}
                      value={grant.value}
                      onChange={() => handleCheckGts(grant.value)}
                    />
                  }
                  label={grant.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Enabled Response modes</FormLabel>
            <FormGroup>
              {responseModes.map(rm => (
                <FormControlLabel
                  key={rm.value}
                  control={
                    <Controller
                      name="responseModes"
                      as={Checkbox}
                      color="primary"
                      control={control}
                      checked={checkedRms.includes(rm.value)}
                      value={rm.value}
                      onChange={() => handleCheckRms(rm.value)}
                    />
                  }
                  label={rm.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Enabled Client authentication methods</FormLabel>
            <FormGroup>
              {authMethods.map(am => (
                <FormControlLabel
                  key={am.value}
                  control={
                    <Controller
                      name="authMethods"
                      as={Checkbox}
                      color="primary"
                      control={control}
                      checked={checkedAms.includes(am.value)}
                      value={am.value}
                      onChange={() => handleCheckAms(am.value)}
                    />
                  }
                  label={am.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Enabled Response types</FormLabel>
            <FormGroup>
              {responseTypes.map(rt => (
                <FormControlLabel
                  key={rt.value}
                  control={
                    <Controller
                      name="responseTypes"
                      as={Checkbox}
                      color="primary"
                      control={control}
                      checked={checkedRts.includes(rt.value)}
                      value={rt.value}
                      onChange={() => handleCheckRts(rt.value)}
                    />
                  }
                  label={rt.label}
                />
              ))}
            </FormGroup>
          </FormControl>
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
  )
}

