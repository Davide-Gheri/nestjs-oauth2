import { createClient, RequestInterceptor } from 'react-fetching-library';

const XSRFToken = document.head.querySelector('meta[name="csrf-token"]');

if (!XSRFToken) {
  console.error('CSRF token not found');
}

const XSRFInterceptor: RequestInterceptor = client => async action => {
  return {
    ...action,
    headers: {
      ...action.headers,
      'X-CSRF-TOKEN': XSRFToken!.getAttribute('content')!,
    }
  }
}

export const client = createClient({
  requestInterceptors: [XSRFInterceptor],
  responseInterceptors: [],
});
