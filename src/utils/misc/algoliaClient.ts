import { algoliasearch } from 'algoliasearch';
import { ALG_API_KEY, ALG_APP_ID } from './constants';

export function getSearchClient() {
  return algoliasearch(ALG_APP_ID, ALG_API_KEY);
}
