import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useClient } from '../../hooks';
import { Box, Typography, Paper, Tabs, Tab, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Avatar } from '@material-ui/core';
import { ExpandMore, WarningRounded } from '@material-ui/icons';
import { ClientBasicInfo, ClientDangerZone, ClientSettings } from '../../components/clients';
import { Error404 } from '../../components/errors';
import { getClientLogo } from '../../utils';
import { Skeleton } from '@material-ui/lab';

const ClientDetailPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params: { id } } }) => {
  const { client, loading, error } = useClient(id);
  const [currentTab, setCurrentTab] = useState(0);

  if (error || (!loading && !client)) {
    return <Error404 message="Client not found"/>
  }

  return (
    <div>
      <Box display="flex" justifyContent="flex-start" alignItems="center" pb={3} px={1}>
        <Box mr={2}>
          {loading ? (
            <Skeleton variant="circle"><Avatar/></Skeleton>
          ) : getClientLogo(client)}
        </Box>
        {loading ? (
          <Skeleton width="150px">
            <Typography>.</Typography>
          </Skeleton>
        ) : (
          <Typography variant="h5">
            {client?.name}
          </Typography>
        )}
      </Box>
      {loading ? (
        <Paper>
          <Box p={2} display="flex">
            <Box mr={1} width="10%"><Skeleton/></Box>
            <Box mr={1} width="10%"><Skeleton/></Box>
          </Box>
          <Box px={2} pb={2}>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={90}/>
          </Box>
        </Paper>
      ) : (
        <Paper>
          <Tabs value={currentTab} onChange={(_, idx) => setCurrentTab(idx)} indicatorColor="primary">
            <Tab value={0} label="Basic information"/>
            <Tab value={1} label="Settings"/>
          </Tabs>
          <Box hidden={currentTab !== 0} px={2} py={3}>
            <ClientBasicInfo client={client!}/>
          </Box>
          <Box hidden={currentTab !== 1} px={2} py={3}>
            <ClientSettings client={client!}/>
          </Box>
        </Paper>
      )}
      {!loading && (
        <Box pt={3}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
              <Box mr={1}>
                <WarningRounded fontSize="small" color="error"/>
              </Box>
              <Typography variant="subtitle2">Danger zone</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ClientDangerZone client={client!}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
      )}
    </div>
  )
}

export default ClientDetailPage;
