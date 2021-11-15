import 'react-loading-skeleton/dist/skeleton.css';
import './post.css';
import { Timestamp } from '@firebase/firestore';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../utils/timeAgo';

export class PostModel {
    id: string | undefined;
    title: string | undefined;
    content: string | undefined;
    author: string | undefined;
    authorId: number | undefined;
    createdAt: Timestamp | undefined;
}

export const Post: React.FC<PostModel> = (data: PostModel) => {
    return (
        <div className="post">
            <div className="postHeader">
                <div className="flex">
                    <small className="secondaryText">
                        {(data.author && `Posted by ${data.author}`) || (
                            <Skeleton />
                        )}
                    </small>
                    <small
                        className="secondaryText"
                        style={{ marginLeft: '0.5rem' }}
                    >
                        {(data.createdAt &&
                            timeAgo(data.createdAt.toDate())) || (
                            <Skeleton baseColor="#E4E4E7" />
                        )}
                    </small>
                </div>
                <p className="postTitle">{data.title || <Skeleton />}</p>
            </div>
            <p className="postContent">
                {data.content || <Skeleton count={7} />}
            </p>
        </div>
    );
};
