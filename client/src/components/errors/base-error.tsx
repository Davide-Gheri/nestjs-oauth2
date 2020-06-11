import React from 'react';
import { Box, Typography } from '@material-ui/core';

export const BaseError: React.FC<{ message: string; code: number }> = ({ message, code }) => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      p={4}
    >
      <Typography variant="h1">{code}</Typography>
      <Typography variant="h6">
        {message}
      </Typography>
    </Box>
  )
}
