import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Paper, Typography, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ClientNewDialog, ClientsList } from '../../components/clients';
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
      <ClientNewDialog onClose={() => setOpen(false)} open={open}/>
    </div>
  )
}

export default ClientsPage;
