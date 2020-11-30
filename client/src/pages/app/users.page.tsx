import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Button, Typography, Paper, DialogTitle, DialogContent, Dialog } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { UserNew, UsersList } from '../../components/users';
import { userCan } from '../../utils';
import { useUsers } from '../../hooks';

const UsersPage: React.FC<RouteComponentProps> = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { users, loading, errorCode, error, total } = useUsers(rowsPerPage, rowsPerPage * page);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagination = {
    total,
    rowsPerPage,
    page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  }

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
        <UsersList
          users={users}
          loading={loading}
          error={error}
          errorCode={errorCode}
          pagination={pagination}
        />
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
