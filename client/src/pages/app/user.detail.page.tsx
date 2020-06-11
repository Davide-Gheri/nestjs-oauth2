import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Avatar,
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Paper,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useUser } from '../../hooks';
import { Error404 } from '../../components/errors';
import { UserEdit, UserDangerZone } from '../../components';
import { ExpandMore, WarningRounded } from '@material-ui/icons';

const UserDetailPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params: { id } } }) => {
  const { user, loading, error } = useUser(id);

  if (error || (!loading && !user)) {
    return <Error404 message="User not found"/>
  }

  return (
    <div>
      <Box display="flex" justifyContent="flex-start" alignItems="center" pb={3} px={1}>
        <Box mr={2}>
          {loading ? (
            <Skeleton variant="circle"><Avatar/></Skeleton>
          ) : (
            <Avatar src={user?.picture}/>
          )}
        </Box>
        {loading ? (
          <Skeleton width="150px">
            <Typography>.</Typography>
            <Typography>.</Typography>
          </Skeleton>
        ) : (
          <>
            <Box>
              <Typography variant="h5">
                {user?.nickname}
              </Typography>
              <Typography variant="subtitle2" color="textPrimary">
                {user?.email}
              </Typography>
            </Box>
            {user?.firstName && user.lastName && (
              <Box ml="auto">
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      {loading ? (
        <Paper>
          <Box px={2} pb={2}>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
            <Skeleton width="100%" height={48}/>
          </Box>
        </Paper>
      ) : (
        <Paper>
          <Box px={2} pb={2}>
            {user && <UserEdit user={user}/>}
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
              <UserDangerZone user={user!}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>
      )}
    </div>
  )
}

export default UserDetailPage;
