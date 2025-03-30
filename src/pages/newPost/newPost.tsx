import css from './NewPost.module.css';
import Select from 'react-select';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Tab, TextField, ThemeProvider } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { CollectionReference, getFirestore } from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../models/post';
import { COMMON_FLAIRS, DB_COLLECTIONS } from '../../utils/misc/constants';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { RichTextbox } from '../../components/newPost/richTextbox/RichTextbox';
import {
  ImageUploader,
  ImageUploaderState,
} from '../../components/newPost/imageUploader/ImageUploader';
import { FileInfo } from '../../components/newPost/imageUploader/DragAndDrop';
import { Poll } from '../../components/newPost/poll/Poll';
import { PollModel } from '../../models/poll';
import {
  getFlairsFromSubreddit,
  getSelectedSubredditName,
  handleCustomFlairClick,
  handleFlairClick,
  handleTabChange,
  submitNewPost,
} from './NewPostActions';
import { UserContext } from '../../context/UserContext';
import { ISubreddit } from '../../models/subreddit';
import { SelectFlairs } from './selectFlairs/SelectFlairs';
import { selectStyles, selectTheme } from './selectFlairs/SelectFlairsStyles';
import { cleanObjectFunctions } from '../../utils/misc/cleanObject';
import { myTheme } from '../../utils/muiThemes/myTheme';
import { UserDataContext } from '../../context/UserDataContext';
import { Navigate, redirect } from '@tanstack/react-router';
import { Route } from '../../routes/new-post';

export const NewPost: FC = () => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const { r: subreddit } = Route.useSearch();
  const [postData, setPostData] = useState(
    new PostModel({
      authorId: user && user.uid,
    }),
  );
  const [postStage, setPostStage] = useState<
    'default' | 'being-submitted' | 'submitted'
  >('default');
  const [subreddits] = useCollectionData(
    collection(
      getFirestore(),
      DB_COLLECTIONS.SUBREDDITS,
    ) as CollectionReference<ISubreddit>,
  );
  const subredditInput = useRef<any>(null);
  const [selectedSubreddit, setSelectedSubreddit] = useState<
    ISubreddit | undefined
  >(subreddits?.find((s) => s.id === subreddit));
  const [tab, setTab] = useState<PostType>('text');
  const [tabState, setTabState] = useState<{
    imageUploaderState?: ImageUploaderState;
    pollState?: PollModel;
  }>();

  useEffect(() => {
    document.title = `Create a new post | Moj Reddit`;

    const tid = setTimeout(() => {
      if (!user) redirect({ to: '/' });
    }, 500);

    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (postStage === 'submitted') {
    return <Navigate to="/" />;
  }

  return (
    <div className={`contentBox ${css.formContainer}`}>
      <form className={css.form}>
        <h1 className={css.label}>Create a new post</h1>
        <div className={css.selectSubreddit}>
          <Select
            ref={subredditInput}
            options={subreddits?.map((s) => ({
              value: s.id,
              label: `r/${s.id}`,
            }))}
            defaultValue={
              subreddit
                ? {
                    value: subreddit,
                    label: `r/${subreddit}`,
                  }
                : { value: 'all', label: 'r/all' }
            }
            styles={{
              ...selectStyles,
              control: (currentStyles: any) => currentStyles,
              singleValue: (currentStyles: any) => currentStyles,
            }}
            theme={selectTheme}
            onChange={(val) => {
              setSelectedSubreddit(
                subreddits?.filter((s) => s.id === val?.value)[0],
              );
            }}
          />
        </div>
        <TextField
          color="warning"
          autoComplete="off"
          className={css.title}
          type="text"
          placeholder="Title"
          value={postData.title}
          onChange={(e) => {
            setPostData(
              new PostModel({
                ...postData,
                title: e.currentTarget.value,
              }),
            );
          }}
        />
        <ThemeProvider theme={myTheme}>
          <TabContext value={tab}>
            <TabList
              onChange={(_, val) =>
                handleTabChange(val, setTab, postData, setPostData)
              }
            >
              <Tab value="text" label="Text" />
              <Tab value="image" label="Image/Video" />
              <Tab value="poll" label="Poll" />
            </TabList>
            <TabPanel value="text">
              <RichTextbox
                value={postData.content || ''}
                onChange={(newValue: string) => {
                  setPostData(
                    new PostModel({
                      ...postData,
                      content: newValue,
                    }),
                  );
                }}
              />
            </TabPanel>
            <TabPanel value="image">
              <ImageUploader
                state={tabState?.imageUploaderState}
                handleNewState={(state) => {
                  setTabState({
                    ...tabState,
                    imageUploaderState: state,
                  });
                }}
                handleContentUpdate={(uploadedFiles: FileInfo[]) => {
                  setPostData(
                    new PostModel({
                      ...postData,
                      contentFiles: (postData.contentFiles || []).concat(
                        uploadedFiles.map((f) => f.storagePath),
                      ),
                    }),
                  );
                }}
              ></ImageUploader>
            </TabPanel>
            <TabPanel value="poll">
              <Poll
                state={tabState?.pollState}
                handleNewState={(state) =>
                  setTabState({
                    ...tabState,
                    pollState: state,
                  })
                }
                handlePollData={(data) => {
                  setPostData(
                    new PostModel({
                      ...postData,
                      pollData: cleanObjectFunctions(data),
                    }),
                  );
                }}
              ></Poll>
            </TabPanel>
          </TabContext>
        </ThemeProvider>
        <div className="flex">
          <div className={css.flairsContainer}>
            {COMMON_FLAIRS.map((f, ind) => (
              <button
                key={ind}
                className={css.btnFlair}
                type="button"
                onClick={(e) => handleFlairClick(e, setPostData, postData)}
              >
                {`#${f}`}
              </button>
            ))}
            {selectedSubreddit?.flairs &&
              selectedSubreddit?.flairs.length > 0 && (
                <SelectFlairs
                  subreddits={subreddits}
                  subredditInput={subredditInput}
                  handleChange={(newFlair) =>
                    handleCustomFlairClick(
                      newFlair,
                      getFlairsFromSubreddit(subreddits, subredditInput)?.map(
                        (f) => f.value,
                      ) || Array(0),
                      setPostData,
                      postData,
                    )
                  }
                />
              )}
          </div>
          <button
            className={css.btnSubmit}
            type="submit"
            disabled={postStage === 'being-submitted'}
            onClick={(e) =>
              submitNewPost(
                e,
                user,
                userData,
                postData,
                setPostStage,
                getSelectedSubredditName(subredditInput) || 'all',
              )
            }
          >
            {postStage === 'being-submitted' ? (
              <FontAwesomeIcon icon={faCircleNotch} spin />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
