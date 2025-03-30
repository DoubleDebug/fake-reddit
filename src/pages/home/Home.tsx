import css from './Home.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ThemeProvider, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFeed } from '../../components/feed/customFeed/CustomFeed';
import { Feed } from '../../components/feed/Feed';
import { myTheme } from '../../utils/muiThemes/myTheme';
import { PostModel } from '../../models/post';
import { displayNotif } from '../../utils/misc/toast';
import { Route } from '../../routes';

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
  const { redirect } = Route.useSearch();

  useEffect(() => {
    document.title = `The front page of the Internet | Moj Reddit`;
    if (redirect === 'accountDeleted') {
      displayNotif('Successfully deleted your account.', 'success');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={css.container}>
      <ThemeProvider theme={myTheme}>
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
            <Tab value="all" label="r/all" className={css.tabButton} />
            <Tab value="custom" label="my feed" className={css.tabButton} />
          </TabList>
          <TabPanel value="all">
            <Feed
              initState={tabState?.all}
              saveStateCallback={(s) => setTabState({ ...tabState, all: s })}
              firstLoad={firstLoad.all}
            />
          </TabPanel>
          <TabPanel value="custom">
            <CustomFeed
              initState={tabState?.custom}
              saveStateCallback={(s) => setTabState({ ...tabState, custom: s })}
              switchTabCallback={() => setTab('all')}
              firstLoad={firstLoad.custom}
            />
          </TabPanel>
        </TabContext>
      </ThemeProvider>
    </div>
  );
};
