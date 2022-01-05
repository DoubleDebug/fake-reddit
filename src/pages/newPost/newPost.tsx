import styles from './NewPost.module.css';
import React, { useRef, useState } from 'react';
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
        addDoc(collection(db, DB_COLLECTIONS.POSTS), postObject).then(() => {
            setIsPosting(false);
            setPosted(true);
            displayNotif('Added a new post.', 'success');
        });
        updateDoc(doc(db, DB_COLLECTIONS.METADATA, 'numOfPosts'), counters);
    };

    if (posted) return <Redirect to="/"></Redirect>;

    return (
        <div>
            {!props.user && <Redirect to="/" />}
            <form className={styles.form}>
                <h1>Create a new post</h1>
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
                />
                <textarea
                    placeholder="What's on your mind?"
                    className={styles.content}
                    onChange={(e) => {
                        setPostData(
                            new PostModel({
                                ...postData,
                                content: e.target.value,
                            })
                        );
                    }}
                />
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
