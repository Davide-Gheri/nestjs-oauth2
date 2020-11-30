/// <reference types="react-scripts" />

// noinspection ES6UnusedImports
import * as history from 'history';
declare module 'history' {
  export interface Location {
    query: Record<string, any>;
  }
}

declare global {
  interface Window {
    __APP_DATA__: {
      user?: any;
      currentSession?: string;
      appName?: string;
      grants: {
        [key: string]: {
          [key: string]: {
            'create:any': string[];
            'update:any': string[];
            'delete:any': string[];
            'read:any': string[];
          };
        };
      };
      [key: string]: any;
    }
  }
}
