import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useAppCurrentUser } from '../../hooks';
import { Box, Avatar, Typography, Paper, Tab, Tabs } from '@material-ui/core';
import { CurrentUserBasicInfoForm, CurrentUserSecurityForm, CurrentUserSessions } from '../../components/current-user';

const CurrentUserPage: React.FC<RouteComponentProps> = () => {
  const user = useAppCurrentUser();
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div>
      <Box display="flex" justifyContent="flex-start" alignItems="center" pb={3} px={1}>
        <Box mr={2}>
          <Avatar src={user?.picture}/>
        </Box>
        <Box>
          <Typography variant="h5">
            {user?.nickname}
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            {user?.email}
          </Typography>
        </Box>
        {user?.firstName && user?.lastName && (
          <Box ml="auto">
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        )}
      </Box>
      <Paper>
        <Tabs value={currentTab} onChange={(_, idx) => setCurrentTab(idx)} indicatorColor="primary">
          <Tab value={0} label="Basic information"/>
          <Tab value={1} label="Security"/>
          <Tab value={2} label="Active logins"/>
        </Tabs>
        <Box hidden={currentTab !== 0} px={2} py={3}>
          <CurrentUserBasicInfoForm/>
        </Box>
        <Box hidden={currentTab !== 1} px={2} py={3}>
          <CurrentUserSecurityForm/>
        </Box>
        <Box hidden={currentTab !== 2} px={2} py={3}>
          <CurrentUserSessions/>
        </Box>
      </Paper>
    </div>
  )
}

export default CurrentUserPage;
