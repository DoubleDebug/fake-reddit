import './newPost.css';
import { User } from '@firebase/auth';
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

interface INewPost {
    user: User | undefined | null;
    firestore: Firestore;
}

export const NewPost: React.FC<INewPost> = (props) => {
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
        addDoc(collection(db, 'posts'), postObject).then(() => {
            setIsPosting(false);
            setPosted(true);
        });
        updateDoc(doc(db, 'metadata', 'counters'), {
            posts: increment(1),
        });
    };

    if (posted) return <Redirect to="/"></Redirect>;

    return (
        <div>
            {!props.user && <Redirect to="/" />}
            <h1 className="middle">Create a new post</h1>
            <form className="newPostForm">
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
