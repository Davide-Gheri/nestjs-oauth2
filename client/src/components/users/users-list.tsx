import React, { useState } from 'react';
import { useUsers } from '../../hooks';
import {
  Box, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, ListItemSecondaryAction,
  IconButton,
  TablePagination, Table, TableFooter, TableRow, Theme, createStyles,
} from '@material-ui/core';
import { ChevronRight, KeyboardArrowLeft, KeyboardArrowRight, LastPage, FirstPage } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Error403 } from '../errors';
import { UserDataFragment } from '../../generated/graphql';
import { ApolloError } from '@apollo/client';

const useStyles = makeStyles(theme => ({
  listItem: {
    borderLeft: 'solid 4px transparent',
  },
  unverified: {
    borderLeft: 'solid 4px',
    borderLeftColor: theme.palette.error.light,
  },
}));

export interface UsersListProps {
  users: UserDataFragment[];
  loading: boolean;
  error: ApolloError | undefined;
  errorCode: string;
  pagination: false | {
    onPageChange: (e: React.MouseEvent<any> | null, newPage: number) => void;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    total: number;
    rowsPerPage: number;
    page: number;
  };
}

export const UsersList: React.FC<UsersListProps> = ({ users, errorCode, error, loading, pagination }) => {
  const classes = useStyles();

  if (error && errorCode === 'FORBIDDEN') {
    return <Error403/>
  }

  return (
    <Box>
      <List disablePadding>
        {loading ? (
          [1, 2].map(k => (
            <ListItem divider key={k}>
              <ListItemAvatar>
                <Skeleton variant="circle"><Avatar/></Skeleton>
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="30%"/>}
                secondary={<Skeleton width="50%"/>}
              />
            </ListItem>
          ))
        ) : (
          users.map(user => (
            <ListItem
              key={user.id}
              divider
              className={clsx(classes.listItem, { [classes.unverified]: !user.emailVerifiedAt })}
            >
              <ListItemAvatar>
                <Avatar src={user.picture}/>
              </ListItemAvatar>
              <ListItemText
                primary={user.nickname}
                secondary={user.email}
              />
              <ListItemSecondaryAction>
                <IconButton component={Link} to={`/app/users/${user.id}`}>
                  <ChevronRight/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
      {pagination && (
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                count={pagination.total}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onChangePage={pagination.onPageChange}
                onChangeRowsPerPage={pagination.onRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Box>
  )
}

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

function TablePaginationActions(props: any) {
  const classes = useStyles1();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
