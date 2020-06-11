import React, { useEffect, useState } from 'react';
import { UserDataFragment } from '../../generated/graphql';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDeleteUser } from '../../hooks';
import { useHistory } from 'react-router';

export const UserDangerZone: React.FC<{ user: UserDataFragment; }> = ({ user }) => {
  const { onSubmit, loading, called } = useDeleteUser(user.id);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    if (!loading && called) {
      history.replace('/app/users');
    }
  }, [called, loading, history]);

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Delete User</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Confirm Deleting?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">The action is irreversible. Type the user nickname below <strong>({user.nickname})</strong> to confirm</Typography>
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
            disabled={typedName !== user.nickname || loading}
            onClick={onSubmit}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
