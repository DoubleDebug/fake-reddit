import './newPost.css';
import { Auth } from '@firebase/auth';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { addDoc, getFirestore, Timestamp } from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../components/post/post';

export const NewPost: React.FC<Auth> = (auth: Auth) => {
    const [user] = useState(auth.currentUser);
    const [isPosting, setIsPosting] = useState(false);
    const [postData, setPostData] = useState(
        new PostModel({
            author: (user && user.displayName) || '',
            authorId: user && user.uid,
        })
    );

    const submitNewPost = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return;

        // loading animation
        setIsPosting(true);

        // send data to firestore
        const db = getFirestore();
        const postObject = Object.assign(
            {},
            {
                ...postData,
                createdAt: Timestamp.now(),
            }
        );
        addDoc(collection(db, 'posts'), postObject).then(() => {
            setIsPosting(false);
        });
    };

    return (
        <div>
            {!user && <Redirect to="/" />}
            <h1 className="middle">Create a new post</h1>
            <form className="newPostForm">
                <input
                    type="text"
                    placeholder="Title"
                    onInput={(e) => {
                        setPostData({
                            ...postData,
                            title: e.currentTarget.value,
                        });
                    }}
                />
                <textarea
                    placeholder="Write something here"
                    style={{ minHeight: '300px' }}
                    onChange={(e) => {
                        setPostData({
                            ...postData,
                            content: e.target.value,
                        });
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
