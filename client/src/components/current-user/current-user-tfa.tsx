import React, { useState } from 'react';
import { useAppCurrentUser, useTfaDisable } from '../../hooks';
import { Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { TfaForm } from './tfa-form';

export const CurrentUserTfa: React.FC = () => {
  const user = useAppCurrentUser();
  const [open, setOpen] = useState(false);
  const { disableTfa, loading } = useTfaDisable();

  if (!user) {
    return null;
  }

  return (
    <>
      {user.tfaEnabled ? (
        <Button
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={disableTfa}
        >
          Disable Two factor authentication
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Enable Two factor authentication</Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Setup Two factor authentication</DialogTitle>
        <DialogContent>
          {open && <TfaForm onClose={() => setOpen(false)}/>}
        </DialogContent>
      </Dialog>
    </>
  )
}
