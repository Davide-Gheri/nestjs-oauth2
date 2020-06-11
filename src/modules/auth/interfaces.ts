import { User } from '@app/entities';

export interface SessionPayload {
  user: User;
  info: {
    ip: string;
    userAgent?: string;
  }
}

export interface SerializedSessionPayload {
  userId: string;
  info: {
    ip: string;
    userAgent?: string;
    createdAt?: number;
  }
}
