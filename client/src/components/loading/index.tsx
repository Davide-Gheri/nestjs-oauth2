import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';

export interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignContent="center"
      justifyContent="center"
      textAlign="center"
    >
      <Box>
        <CircularProgress/>
      </Box>
      <Box pt={2}>
        <Typography variant="subtitle2">
          {message}
        </Typography>
      </Box>
    </Box>
  )
}
