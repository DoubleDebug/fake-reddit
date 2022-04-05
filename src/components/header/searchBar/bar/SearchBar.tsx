import { useState } from 'react';
import styles from './SearchBar.module.css';
import { Hits, InstantSearch } from 'react-instantsearch-dom';
import { getSearchClient } from '../../../../utils/misc/algoliaClient';
import { PostHit } from '../hit/PostHit';
import { CustomSearchBox } from '../box/CustomSearchBox';
import { validateQuery } from './SearchBarActions';

export const SearchBar: React.FC = () => {
    const [searchClient] = useState(getSearchClient());
    const [displayHits, setDisplayHits] = useState(false);

    return (
        <div className={styles.container}>
            <InstantSearch indexName="posts" searchClient={searchClient}>
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
