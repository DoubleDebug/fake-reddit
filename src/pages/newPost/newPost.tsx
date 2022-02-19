import styles from './NewPost.module.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';
import { getFirestore } from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../models/post';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { RichTextbox } from '../../components/newPost/richTextbox/RichTextbox';
import { Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext, TabList } from '@mui/lab';
import {
    ImageUploader,
    ImageUploaderState,
} from '../../components/newPost/imageUploader/ImageUploader';
import { FileInfo } from '../../components/newPost/imageUploader/DragAndDrop';
import { Poll } from '../../components/newPost/poll/Poll';
import { PollModel } from '../../models/poll';
import {
    getFileMarkup,
    handleTabChange,
    submitNewPost,
} from './NewPostActions';
import { UserContext } from '../../context/UserContext';

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
    const [subreddits] = useCollectionDataOnce(
        collection(getFirestore(), DB_COLLECTIONS.SUBREDDITS),
        {
            idField: 'value',
        }
    );
    const subredditInput = useRef<any>(null);
    const [tabIndex, setTabIndex] = useState('1');
    const [tabState, setTabState] = useState<{
        imageUploaderState?: ImageUploaderState;
        pollState?: PollModel;
    }>();

    useEffect(() => {
        // update post type
        const postTypes: Array<PostType> = ['text', 'image', 'poll'];
        const newType = postTypes[Number(tabIndex) - 1];

        setPostData(
            new PostModel({
                ...postData,
                type: newType,
            })
        );
        // eslint-disable-next-line
    }, [tabIndex]);

    if (!user || postStage === 'submitted') {
        return <Redirect to="/" />;
    }

    return (
        <div className={`contentBox ${styles.formContainer}`}>
            <form className={styles.form}>
                <h1 className={styles.label}>Create a new post</h1>
                <div className={styles.selectSubreddit}>
                    <Select
                        ref={subredditInput}
                        options={subreddits?.map((s) => {
                            return {
                                value: s.value,
                                label: `r/${s.value}`,
                            };
                        })}
                        defaultValue={
                            props.subreddit
                                ? {
                                      value: props.subreddit,
                                      label: `r/${props.subreddit}`,
                                  }
                                : { value: 'all', label: 'r/all' }
                        }
                    ></Select>
                </div>
                <input
                    className={styles.title}
                    type="text"
                    placeholder="Title"
                    onInput={(e) => {
                        setPostData(
                            new PostModel({
                                ...postData,
                                title: e.currentTarget.value,
                            })
                        );
                    }}
                    value={postData.title}
                />
                <TabContext value={tabIndex}>
                    <TabList
                        onChange={(_, val) => handleTabChange(val, setTabIndex)}
                    >
                        <Tab value="1" label="Text" />
                        <Tab value="2" label="Image/Video" />
                        <Tab value="3" label="Poll" />
                    </TabList>
                    <TabPanel value="1">
                        <RichTextbox
                            value={postData.content}
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
                    <TabPanel value="2">
                        <ImageUploader
                            state={tabState?.imageUploaderState}
                            handleNewState={(state) => {
                                setTabState({
                                    ...tabState,
                                    imageUploaderState: state,
                                });
                            }}
                            handleFileStoragePath={(fileInfo: FileInfo) => {
                                setPostData(
                                    new PostModel({
                                        ...postData,
                                        content: getFileMarkup(fileInfo),
                                        contentFiles: [
                                            ...(postData.contentFiles || []),
                                            fileInfo.storagePath,
                                        ],
                                    })
                                );
                            }}
                        ></ImageUploader>
                    </TabPanel>
                    <TabPanel value="3">
                        <Poll
                            state={tabState?.pollState}
                            handleNewState={(state) =>
                                setTabState({ ...tabState, pollState: state })
                            }
                            handlePollData={(data) => {
                                setPostData(
                                    new PostModel({
                                        ...postData,
                                        pollData: JSON.parse(
                                            JSON.stringify(data)
                                        ),
                                    })
                                );
                            }}
                        ></Poll>
                    </TabPanel>
                </TabContext>
                <div className="flex">
                    <button
                        className={`btn ${styles.btnSubmit}`}
                        type="submit"
                        disabled={postStage === 'being-submitted'}
                        onClick={(e) =>
                            submitNewPost(
                                e,
                                user,
                                postData,
                                setPostStage,
                                subredditInput.current
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
