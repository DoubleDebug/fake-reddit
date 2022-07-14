import css from './SearchBar.module.css';
import { useContext, useState } from 'react';
import { Hits, Index, InstantSearch } from 'react-instantsearch-dom';
import { getSearchClient } from '../../../../utils/misc/algoliaClient';
import { PostHit } from '../hit/PostHit';
import { CustomSearchBox } from '../box/CustomSearchBox';
import { validateQuery } from './SearchBarActions';
import { ALG_INDICES } from '../../../../utils/misc/constants';
import { SubredditHit } from '../hit/SubredditHit';
import { HeaderContext } from '../../../../context/HeaderContext';

export const SearchBar: React.FC = () => {
  const [searchClient] = useState(getSearchClient());
  const [displayHits, setDisplayHits] = useState(false);
  const { isSearchBarFocused } = useContext(HeaderContext);

  return (
    <div
      className={`${css.container} ${isSearchBarFocused ? css.focused : ''}`}
    >
      <InstantSearch indexName={ALG_INDICES.POSTS} searchClient={searchClient}>
        <CustomSearchBox
          onChangeCallback={(q) => validateQuery(q, setDisplayHits)}
          onBlurCallback={() => setDisplayHits(false)}
          onFocusCallback={(q) => validateQuery(q, setDisplayHits)}
        />
        <Index indexName={ALG_INDICES.SUBREDDITS}>
          {displayHits && (
            <Hits
              hitComponent={(data: any) => <SubredditHit {...data.hit} />}
            />
          )}
        </Index>
        <Index indexName={ALG_INDICES.POSTS}>
          {displayHits && (
            <Hits hitComponent={(data: any) => <PostHit {...data.hit} />} />
          )}
        </Index>
      </InstantSearch>
    </div>
  );
};
