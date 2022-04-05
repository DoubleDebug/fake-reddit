import css from './SearchBar.module.css';
import { useState } from 'react';
import { Hits, InstantSearch } from 'react-instantsearch-dom';
import { getSearchClient } from '../../../../utils/misc/algoliaClient';
import { PostHit } from '../hit/PostHit';
import { CustomSearchBox } from '../box/CustomSearchBox';
import { validateQuery } from './SearchBarActions';
import { ALG_INDICES } from '../../../../utils/misc/constants';

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
                {displayHits && (
                    <Hits
                        hitComponent={(data: any) => <PostHit {...data.hit} />}
                    />
                )}
            </InstantSearch>
        </div>
    );
};
