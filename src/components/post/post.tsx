import 'react-loading-skeleton/dist/skeleton.css';
import './post.css';
import { Timestamp } from '@firebase/firestore';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/timeAgo';

export class PostModel {
    title: string = '';
    content: string = '';
    author: string = '';
    authorId: string | undefined | null;
    createdAt: Timestamp = Timestamp.now();

    constructor(init?: Partial<PostModel>) {
        Object.assign(this, init);
    }
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
            <div className="postContent">
                {data.content || <Skeleton count={7} />}
            </div>
        </div>
    );
};
