import { Timestamp } from '@firebase/firestore';
import React from 'react';
import { timeAgo } from '../utils/timeAgo';
import './post.css';

export interface PostModel {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: number;
    createdAt: Timestamp;
};

export const Post: React.FC<PostModel> = (data: PostModel) => {
    return (
        <div className="post">
            <div className="postHeader">
                <div className="flex">
                    <small className="secondaryText">Posted by {data.author}</small>
                    <small className="secondaryText" style={{marginLeft: "0.5rem"}}>• {timeAgo(data.createdAt.toDate())}</small>
                </div>
                <p className="postTitle">{data.title}</p>
            </div>
            <p className="postContent">{data.content}</p>
        </div>
    );
};
