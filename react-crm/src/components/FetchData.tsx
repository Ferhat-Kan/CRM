import { SERVER } from '../services/ApiUrls';

export const Header = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
  org: localStorage.getItem('org'),
};

export const Header1 = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('Token'),
};

export function fetchData(
  url: string,
  method: string,
  data: any = '',
  header: any
) {
  if (!SERVER) throw new Error('API base URL (SERVER) is not defined!');
  const base = SERVER.endsWith('/') ? SERVER : SERVER + '/';
  const fullUrl = url.startsWith('/') ? url.slice(1) : url;
  return fetch(`${base}${fullUrl}`, {
    method,
    headers: header,
    body: data,
  }).then((response) => response.json());
}
