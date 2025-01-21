import css from './SearchBar.module.css';
import { useContext, useState } from 'react';
import { Hits, Index, InstantSearch } from 'react-instantsearch';
import { getSearchClient } from '../../../../utils/misc/algoliaClient';
import { PostHit } from '../hit/PostHit';
import { CustomSearchBox } from '../box/CustomSearchBox';
import { ALG_INDICES } from '../../../../utils/misc/constants';
import { SubredditHit } from '../hit/SubredditHit';
import { HeaderContext } from '../../../../context/HeaderContext';

export const SearchBar: React.FC = () => {
  const [searchClient] = useState(getSearchClient());
  const { isSearchBarFocused } = useContext(HeaderContext);

  return (
    <div
      className={`${css.container} ${isSearchBarFocused ? css.focused : ''}`}
    >
      <InstantSearch indexName={ALG_INDICES.POSTS} searchClient={searchClient}>
        <CustomSearchBox />
        <Index indexName={ALG_INDICES.SUBREDDITS}>
          <Hits hitComponent={(data: any) => <SubredditHit {...data.hit} />} />
        </Index>
        <Index indexName={ALG_INDICES.POSTS}>
          <Hits hitComponent={(data: any) => <PostHit {...data.hit} />} />
        </Index>
      </InstantSearch>
    </div>
  );
};
