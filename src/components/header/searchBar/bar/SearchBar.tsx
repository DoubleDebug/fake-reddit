import css from './SearchBar.module.css';
import { useState } from 'react';
import { Hits, Index, InstantSearch } from 'react-instantsearch-dom';
import { getSearchClient } from '../../../../utils/misc/algoliaClient';
import { PostHit } from '../hit/PostHit';
import { CustomSearchBox } from '../box/CustomSearchBox';
import { validateQuery } from './SearchBarActions';
import { ALG_INDICES } from '../../../../utils/misc/constants';
import { SubredditHit } from '../hit/SubredditHit';

export const SearchBar: React.FC = () => {
    const [searchClient] = useState(getSearchClient());
    const [displayHits, setDisplayHits] = useState(false);

    return (
        <div className={css.container}>
            <InstantSearch
                indexName={ALG_INDICES.POSTS}
                searchClient={searchClient}
            >
                <CustomSearchBox
                    onChangeCallback={(q) => validateQuery(q, setDisplayHits)}
                    onBlurCallback={() => setDisplayHits(false)}
                    onFocusCallback={(q) => validateQuery(q, setDisplayHits)}
                />
                <Index indexName={ALG_INDICES.SUBREDDITS}>
                    {displayHits && (
                        <Hits
                            hitComponent={(data: any) => (
                                <SubredditHit {...data.hit} />
                            )}
                        />
                    )}
                </Index>
                <Index indexName={ALG_INDICES.POSTS}>
                    {displayHits && (
                        <Hits
                            hitComponent={(data: any) => (
                                <PostHit {...data.hit} />
                            )}
                        />
                    )}
                </Index>
            </InstantSearch>
        </div>
    );
};
