import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Button, Typography, Paper, DialogTitle, DialogContent, Dialog } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { UserNew, UsersList } from '../../components/users';
import { userCan } from '../../utils';

const UsersPage: React.FC<RouteComponentProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" pb={3} px={1}>
        <Typography variant="h5">All Users</Typography>
        {userCan('user', 'create:any') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add/>}
            onClick={() => setOpen(true)}
          >
            Create new
          </Button>
        )}
      </Box>
      <Paper>
        <UsersList/>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Create a new User
        </DialogTitle>
        <DialogContent>
          <UserNew onSubmit={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersPage;
