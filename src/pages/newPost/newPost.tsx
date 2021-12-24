import styles from './newPost.module.css';
import React, { useState } from 'react';
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
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../models/post';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS } from '../../utils/constants';

interface INewPostProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const NewPost: React.FC<INewPostProps> = (props) => {
    const [isPosting, setIsPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [postData, setPostData] = useState(
        new PostModel({
            author: (props.user && props.user.displayName) || '',
            authorId: props.user && props.user.uid,
        })
    );

    const submitNewPost = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!props.user) return;

        // loading animation
        setIsPosting(true);

        // prepare data
        const postObject = {
            ...postData,
            createdAt: Timestamp.now(),
        };
        delete postObject.id;

        // send data to firestore
        const db = getFirestore();
        addDoc(collection(db, DB_COLLECTIONS.POSTS), postObject).then(() => {
            setIsPosting(false);
            setPosted(true);
        });
        updateDoc(doc(db, DB_COLLECTIONS.METADATA, 'counters'), {
            posts: increment(1),
        });
    };

    if (posted) return <Redirect to="/"></Redirect>;

    return (
        <div>
            {!props.user && <Redirect to="/" />}
            <h1 className="middle">Create a new post</h1>
            <form className={styles.newPostForm}>
                <input
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
                    placeholder="Write something here"
                    style={{ minHeight: '300px' }}
                    onChange={(e) => {
                        setPostData(
                            new PostModel({
                                ...postData,
                                content: e.target.value,
                            })
                        );
                    }}
                />
                <button
                    className="btn"
                    type="submit"
                    disabled={isPosting}
                    onClick={(e) => submitNewPost(e)}
                >
                    {isPosting ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};
