import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { ClientDataFragment } from '../../generated/graphql';
import { useDeleteClient } from '../../hooks';
import { useHistory } from 'react-router';

export const ClientDangerZone: React.FC<{ client: ClientDataFragment }> = ({ client }) => {
  const { onSubmit, loading, called } = useDeleteClient(client.id);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    if (!loading && called) {
      history.replace('/app/clients');
    }
  }, [called, loading, history]);

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Delete Client</Button>
      <Box pt={2}>
        <Typography variant="body2">Deleting the client will automatically revoke all issued tokens, thus revoking access to all users that are using them</Typography>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Confirm Deleting?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Deleting the client will automatically revoke all issued tokens, thus revoking access to all users that are using them</Typography>
          <Typography variant="body2">The action is irreversible. Type the client name below <strong>({client.name})</strong> to confirm</Typography>
          <Box pt={2}>
            <TextField
              value={typedName}
              onChange={e => setTypedName(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            disabled={typedName !== client.name || loading}
            onClick={onSubmit}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};
