import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ClientNew, ClientsList } from '../../components/clients';
import { userCan } from '../../utils';

const ClientsPage: React.FC<RouteComponentProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" pb={3} px={1}>
        <Typography variant="h5">All Clients</Typography>
        {userCan('client', 'create:any') && (
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
        <ClientsList/>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Create a new Client
        </DialogTitle>
        <DialogContent>
          <ClientNew onSubmit={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ClientsPage;
