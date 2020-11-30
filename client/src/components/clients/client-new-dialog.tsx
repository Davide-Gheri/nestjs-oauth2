import React from 'react';
import { Dialog, DialogContent, DialogProps, DialogTitle } from '@material-ui/core';
import { ClientNew } from './client-new';

export interface ClientNewDialogProps extends DialogProps {
  onClose: () => void;
  onSubmit?: () => void;
}

export const ClientNewDialog: React.FC<ClientNewDialogProps> = ({ onSubmit, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogTitle>
        Create a new Client
      </DialogTitle>
      <DialogContent>
        <ClientNew onSubmit={onSubmit || props.onClose}/>
      </DialogContent>
    </Dialog>
  )
}
