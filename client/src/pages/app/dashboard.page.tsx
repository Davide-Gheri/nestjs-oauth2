import React, { useCallback, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { Box, Button, Grid, Card, CardHeader } from '@material-ui/core';
import { RecapCard } from '../../components/recap-cards';
import { Add, People } from '@material-ui/icons';
import { useDashboard } from '../../hooks';
import { userCan } from '../../utils';
import { ClientNewDialog } from '../../components/clients';
import { UsersList } from '../../components/users';

const DashboardPage: React.FC<RouteComponentProps> = () => {
  const { counts: { users, clients, signUps }, lastUsers, errorCode, error, loading } = useDashboard();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const onClientSubmit = useCallback(() => {
    setOpen(false);
    history.push('/app/clients');
  }, [setOpen, history]);

  return (
    <>
      <Box display="flex" mb={2} justifyContent="flex-end">
        {userCan('client', 'create:any') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add/>}
            onClick={() => setOpen(true)}
          >
            Create new Client
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid xs={12} sm={4} item>
          <RecapCard
            icon={<People/>}
            label="Users"
            count={users || 0}
          />
        </Grid>
        <Grid xs={12} sm={4} item>
          <RecapCard
            icon={<People/>}
            label="Clients"
            count={clients || 0}
          />
        </Grid>
        <Grid xs={12} sm={4} item>
          <RecapCard
            icon={<People/>}
            label="New SignUps"
            count={signUps || 0}
          />
        </Grid>
        <Grid xs={12} sm={6} item>
          <Card>
            <CardHeader title="Latest users"/>
            <UsersList
              users={lastUsers}
              loading={loading}
              error={error}
              errorCode={errorCode}
              pagination={false}
            />
          </Card>
        </Grid>
      </Grid>
      <ClientNewDialog
        onSubmit={onClientSubmit}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  )
}

export default DashboardPage;
