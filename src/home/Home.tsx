import { getFirestore } from "@firebase/firestore";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Post, PostModel } from "../post/post";
import "./Home.css";

export const Home: React.FC = () => {
    const [posts, setPosts] = useState<PostModel[]>([]);

    const db = getFirestore();
    getDocs(collection(db, "posts")).then(postsData => {
        const postsArr: PostModel[] = [];
        postsData.forEach((doc) => {
            const postData = doc.data();
            const newPost: PostModel = {
                id: doc.id,
                title: postData.title,
                content: postData.content,
                author: postData.author,
                authorId: postData.authorId,
                createdAt: postData.createdAt,
            };
            postsArr.push(newPost);
          });
        setPosts(postsArr);
    });

    return (<div>{
        posts.length !== 0
        ? <div className="postsContainer">
            {posts.map((p: PostModel, index: number) => <div key={index}><Post {...p}></Post></div>)}
          </div>
        : <h1 className="middle">Loading...</h1>
    }</div>);
};
