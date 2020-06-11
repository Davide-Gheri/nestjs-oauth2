import React from 'react';
import { useActiveSessions } from '../../hooks';
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell, Theme,
  Button,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { SessionDataFragment } from '../../generated/graphql';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const columns = [
  {
    label: 'Session start',
    align: 'left' as 'left',
    key: 'createdAt',
  },
  {
    label: 'IP address',
    align: 'left' as 'left',
    key: 'ip',
  },
  {
    label: 'Detected Browser/OS',
    align: 'left' as 'left',
    key: (item: SessionDataFragment) => `${item.browser}, ${item.os}`,
  },
]

const useStyles = makeStyles((theme: Theme) => ({
  sessionRow: {
    borderLeft: 'solid 4px transparent',
  },
  currentSession: {
    borderLeft: 'solid 4px',
    borderLeftColor: theme.palette.success.main,
  },
  table: {
    minWidth: 500,
  },
}));

export const CurrentUserSessions: React.FC = () => {
  const { sessions, loading, currentSession, deleteSession } = useActiveSessions();
  const classes = useStyles();

  return (
    <Box>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell align={col.align} key={col.label}>{col.label}</TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2].map(k => (
                <TableRow key={k}>
                  {columns.map(col => (
                    <TableCell align={col.align} key={col.label}>
                      <Skeleton/>
                    </TableCell>
                  ))}
                  <TableCell/>
                </TableRow>
              ))
            ) : (
              sessions!.map(session => (
                <TableRow key={session.sessionId} className={clsx(classes.sessionRow, {
                  [classes.currentSession]: session.sessionId === currentSession,
                })}>
                  {columns.map(col => (
                    <TableCell align={col.align} key={col.label}>
                      {typeof col.key === 'function' ? col.key(session) : session[col.key as keyof SessionDataFragment]}
                    </TableCell>
                  ))}
                  <TableCell>
                    {session.sessionId !== currentSession && (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => deleteSession(session.sessionId)}
                      >
                        End
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
