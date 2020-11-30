import React, { useEffect, useRef, useState } from 'react';
import { useTfaRequest } from '../../hooks';
import { Box, Typography, FormControl, FormHelperText } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
// @ts-ignore
import ReactCodeInput from 'react-code-input';
import { useSnackbar } from 'notistack';

export const TfaForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { requestTfa, verifyTfa, qrCode, error, requestLoading, verifyLoading } = useTfaRequest();

  const [code, setCode] = useState<string | null>('');
  const verifying = useRef(false);

  useEffect(() => {
    requestTfa();
  }, []);

  useEffect(() => {
    if (code?.length === 6 && !verifying.current) {
      verifying.current = true;
      verifyTfa(code)
        .then(ok => {
          verifying.current = false;
          if (ok) {
            console.log('here')
            enqueueSnackbar('Two factor authentication enabled', {
              variant: 'success',
            });
            onClose();
          }
        });
    }
  }, [code, onClose]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        flexDirection="column"
      >
        <Typography variant="subtitle1">
          Open your two factor authentication App (ex. Google Authenticator) and scan the QR code
        </Typography>
        {(requestLoading && !qrCode) ? (
          <Skeleton variant="rect" width={150} height={150}/>
        ) : (
          <img src={qrCode!}/>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        width="100%"
        flexDirection="column"
      >
        <Typography variant="subtitle1">Insert the Two factor authentication code here</Typography>
        <FormControl error={!!error}>
          <ReactCodeInput
            type="number"
            fields={6}
            className="code-input"
            inputMode="numeric"
            value={code}
            onChange={setCode}
            disabled={verifyLoading}
            inputStyle={{
              WebkitAppearance: 'none',
              fontFamily: 'monospace',
              borderRadius: '6px',
              border: '1px solid lightgrey',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0px',
              margin: '4px',
              paddingLeft: '8px',
              width: '36px',
              height: '42px',
              fontSize: '32px',
              boxSizing: 'border-box',
              color: 'black',
              backgroundColor: 'white',
            }}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      </Box>
    </>
  )
}
