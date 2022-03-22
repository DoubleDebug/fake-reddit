import algoliasearch from 'algoliasearch';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from './constants';

export function getSearchClient() {
    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
}
