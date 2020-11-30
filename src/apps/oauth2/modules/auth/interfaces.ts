
export interface SerializedPassportSessionPayload {
  user: string;
  info: {
    ip: string;
    userAgent?: string;
    createdAt?: number;
  }
}
