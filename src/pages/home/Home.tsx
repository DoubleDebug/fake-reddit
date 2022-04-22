import css from './Home.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ThemeProvider, Tab } from '@mui/material';
import { useState } from 'react';
import { CustomFeed } from '../../components/feed/customFeed/CustomFeed';
import { Feed } from '../../components/feed/Feed';
import { tabsTheme } from '../newPost/selectFlairs/SelectFlairsStyles';
import { PostModel } from '../../models/post';

export interface IFeedState {
    posts?: PostModel[];
    offset?: number;
    totalNumOfPosts?: number;
}

export const Home: React.FC = () => {
    const [tab, setTab] = useState<'all' | 'custom'>('all');
    const [tabState, setTabState] = useState<{
        all?: IFeedState;
        custom?: IFeedState;
    }>();
    const [firstLoad, setFirstLoad] = useState({
        all: true,
        custom: true,
    });
    return (
        <div className={css.container}>
            <ThemeProvider theme={tabsTheme}>
                <TabContext value={tab}>
                    <TabList
                        onChange={(_, val) => {
                            setTab(val);
                            if (val === 'all')
                                setFirstLoad({
                                    ...firstLoad,
                                    custom: false,
                                });
                            else
                                setFirstLoad({
                                    ...firstLoad,
                                    all: false,
                                });
                        }}
                    >
                        <Tab
                            value="all"
                            label="r/all"
                            className={css.tabButton}
                        />
                        <Tab
                            value="custom"
                            label="my feed"
                            className={css.tabButton}
                        />
                    </TabList>
                    <TabPanel value="all">
                        <Feed
                            initState={tabState?.all}
                            saveStateCallback={(s) =>
                                setTabState({ ...tabState, all: s })
                            }
                            firstLoad={firstLoad.all}
                        />
                    </TabPanel>
                    <TabPanel value="custom">
                        <CustomFeed
                            initState={tabState?.custom}
                            saveStateCallback={(s) =>
                                setTabState({ ...tabState, custom: s })
                            }
                            switchTabCallback={() => setTab('all')}
                            firstLoad={firstLoad.custom}
                        />
                    </TabPanel>
                </TabContext>
            </ThemeProvider>
        </div>
    );
};
