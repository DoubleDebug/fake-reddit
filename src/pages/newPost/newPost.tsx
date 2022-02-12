import styles from './NewPost.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';
import {
    addDoc,
    doc,
    Firestore,
    getFirestore,
    increment,
    Timestamp,
    updateDoc,
} from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../models/post';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS } from '../../utils/constants';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Select from 'react-select';
import { displayNotif } from '../../utils/toast';
import 'react-quill/dist/quill.snow.css';
import { RichTextbox } from '../../components/richTextbox/RichTextbox';
import { Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext, TabList } from '@mui/lab';
import { ImageUploader } from '../../components/imageUploader/ImageUploader';
import { FileInfo } from '../../components/imageUploader/DragAndDrop';
import { isFileImage, isFileVideo } from '../../utils/getFileExtension';

interface INewPostProps {
    user: User | undefined | null;
    firestore: Firestore;
    subreddit?: string;
}

export const NewPost: React.FC<INewPostProps> = (props) => {
    const [postData, setPostData] = useState(
        new PostModel({
            author: (props.user && props.user.displayName) || '',
            authorId: props.user && props.user.uid,
        })
    );
    const [isPosting, setIsPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [subreddits] = useCollectionDataOnce(
        collection(props.firestore, DB_COLLECTIONS.SUBREDDITS),
        {
            idField: 'value',
        }
    );
    const subredditInput = useRef<any>(null);
    const [tabIndex, setTabIndex] = useState('1');

    useEffect(() => {
        // lol
        // this cleans up and cancels async tasks
        // and gets rid of the "unmounted component" error
        return () => {};
    }, []);

    // ACTIONS
    const submitNewPost = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!props.user) return;

        // loading animation
        setIsPosting(true);

        // prepare data
        const sub = subredditInput.current.props.value.value;
        const postObject = {
            ...postData,
            createdAt: Timestamp.now(),
            subreddit: sub,
        };
        delete postObject.id;
        const counters: any = {
            all: increment(1),
        };
        if (sub !== 'all') counters[sub] = increment(1);

        // send data to firestore
        const db = getFirestore();
        addDoc(collection(db, DB_COLLECTIONS.POSTS), postObject)
            .then(() => {
                updateDoc(
                    doc(db, DB_COLLECTIONS.METADATA, 'numOfPosts'),
                    counters
                );

                setIsPosting(false);
                setPosted(true);
                displayNotif('Added a new post.', 'success');
            })
            .catch((error) => {
                console.log(error);
                displayNotif('Failed to add a new post.', 'error');
            });
    };
    const handleTabChange = (tabNumber: string) => {
        setTabIndex(tabNumber);

        // update post type
        const postTypes: Array<PostType> = ['text', 'image', 'poll'];
        const newType = postTypes[Number(tabNumber) - 1];
        setPostData(
            new PostModel({
                ...postData,
                type: newType,
            })
        );
    };
    const getFileMarkup = (fileInfo: FileInfo) => {
        if (isFileImage(fileInfo.fileName)) return `<img src=${fileInfo.url}/>`;

        if (isFileVideo(fileInfo.fileName))
            return `<video src=${fileInfo.url} controls loop></video>`;

        return '';
    };

    if (posted) return <Redirect to="/"></Redirect>;

    return (
        <div className={`contentBox ${styles.formContainer}`}>
            <form className={styles.form}>
                {!props.user && <Redirect to="/" />}
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
                    <TabList onChange={(_, val) => handleTabChange(val)}>
                        <Tab value="1" label="Text" />
                        <Tab value="2" label="Image/Video" />
                        <Tab value="3" label="Poll" />
                    </TabList>
                    <TabPanel value="1">
                        <RichTextbox
                            value={postData.content}
                            onChange={(newValue) => {
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
                    <TabPanel value="3"></TabPanel>
                </TabContext>
                <div className="flex">
                    <button
                        className={`btn ${styles.btnSubmit}`}
                        type="submit"
                        disabled={isPosting}
                        onClick={(e) => submitNewPost(e)}
                    >
                        {isPosting ? (
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
