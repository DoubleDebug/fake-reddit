import 'react-quill/dist/quill.snow.css';
import css from './NewPost.module.css';
import Select from 'react-select';
import React, { useContext, useEffect, useRef, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Tab, TextField, ThemeProvider } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { Redirect } from 'react-router';
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

interface INewPostProps {
    subreddit?: string;
}

export const NewPost: React.FC<INewPostProps> = (props) => {
    const user = useContext(UserContext);
    const [postData, setPostData] = useState(
        new PostModel({
            author: (user && user.displayName) || '',
            authorId: user && user.uid,
        })
    );
    const [postStage, setPostStage] = useState<
        'default' | 'being-submitted' | 'submitted'
    >('default');
    const [subreddits] = useCollectionData(
        collection(
            getFirestore(),
            DB_COLLECTIONS.SUBREDDITS
        ) as CollectionReference<ISubreddit>,
        {
            idField: 'id',
        }
    );
    const subredditInput = useRef<any>(null);
    const [selectedSubreddit, setSelectedSubreddit] = useState<
        ISubreddit | undefined
    >(subreddits?.filter((s) => s.id === props.subreddit)[0]);
    const [tab, setTab] = useState<PostType>('text');
    const [tabState, setTabState] = useState<{
        imageUploaderState?: ImageUploaderState;
        pollState?: PollModel;
    }>();

    useEffect(() => {
        document.title = `Create a new post | Fake Reddit`;
    }, []);

    if (!user || postStage === 'submitted') {
        return <Redirect to="/" />;
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
                            props.subreddit
                                ? {
                                      value: props.subreddit,
                                      label: `r/${props.subreddit}`,
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
                                subreddits?.filter(
                                    (s) => s.id === val?.value
                                )[0]
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
                            })
                        );
                    }}
                />
                <ThemeProvider theme={myTheme}>
                    <TabContext value={tab}>
                        <TabList
                            onChange={(_, val) =>
                                handleTabChange(
                                    val,
                                    setTab,
                                    postData,
                                    setPostData
                                )
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
                                        })
                                    );
                                }}
                            ></RichTextbox>
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
                                handleContentUpdate={(
                                    uploadedFiles: FileInfo[]
                                ) => {
                                    setPostData(
                                        new PostModel({
                                            ...postData,
                                            contentFiles: (
                                                postData.contentFiles || []
                                            ).concat(
                                                uploadedFiles.map(
                                                    (f) => f.storagePath
                                                )
                                            ),
                                        })
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
                                            pollData:
                                                cleanObjectFunctions(data),
                                        })
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
                                onClick={(e) =>
                                    handleFlairClick(e, setPostData, postData)
                                }
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
                                            getFlairsFromSubreddit(
                                                subreddits,
                                                subredditInput
                                            )?.map((f) => f.value) || Array(0),
                                            setPostData,
                                            postData
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
                                postData,
                                setPostStage,
                                getSelectedSubredditName(subredditInput) ||
                                    'all'
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
