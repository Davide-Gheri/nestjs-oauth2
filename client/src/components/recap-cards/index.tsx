import React from 'react';
import { Avatar, Card, CardHeader } from '@material-ui/core';

export interface RecapCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
}

export const RecapCard: React.FC<RecapCardProps> = ({ icon, count, label }) => {
  return (
    <Card>
      <CardHeader
        title={count}
        subheader={label}
        avatar={
          <Avatar>
            {icon}
          </Avatar>
        }
      />
    </Card>
  )
}
