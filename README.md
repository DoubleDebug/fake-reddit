# FakeReddit

Reddit website clone with React, Typescript and Firebase.

## Live preview

(link not available yet)

![FakeReddit screenshot](https://i.imgur.com/0t4tMg9.png)

## Features

-   Home feed and subreddits
-   Sign in with email/password, Google or GitHub
-   3 types of posts:
    -   Text
    -   Image/video
    -   Poll
-   Upvote/downvote posts
-   Post comments
-   Inbox & chatting with other redditors
-   Searching for posts

## Technology stack

| Front-end:                                                                                    | Back-end:                           |
| :-------------------------------------------------------------------------------------------- | :---------------------------------- |
| React                                                                                         | NodeJS                              |
|                                                                                               | Express                             |
| Typescript                                                                                    | Typescript                          |
| Firebase<ul><li>Auth</li><li>Firestore</li><li>Storage</li><li>React Firebase Hooks</li></ul> | Firebase<ul><li>Admin SDK</li></ul> |
| Axios                                                                                         | Algolia Search                      |
| React Router Dom                                                                              | Node Cron                           |
| Material UI                                                                                   | DotEnv                              |
| FontAwesome icons                                                                             |
| React Hot Toast                                                                               |
| React Loading Skeleton                                                                        |
| React Quill                                                                                   |

## How to run locally

0. Install [NodeJS](https://nodejs.org/en/).
1. Clone both [frontend](https://github.com/DoubleDebug/fake-reddit) and [backend](https://github.com/DoubleDebug/fake-reddit-backend) repositories.
2. Install dependencies in both folders.
    - Run `npm install`
3. Set up environment variables.
    - Back-end:
      | File name | Description |
      | --------- | ----------- |
      | fake-reddit-backend/.env | Environment variables such as the client URL, <br> port number, hostname, algolia api key, etc. <br> See an example [here](). |
      | fake-reddit-backend/serviceAccountKey.json | Firebase Admin SDK configuration file. <br> Read more [here](https://firebase.google.com/docs/admin/setup). |
    - Front-end:
      | File name | Description |
      | --------- | ----------- |
      | fake-reddit/.env | Environment variables such as the client URL <br> & server URL. See an example [here](). |
      | fake-reddit/src/utils/firebase/firebaseConfig.ts | Firebase configuration file containing the api key, <br> auth domain, etc. Read more [here](). |
      | fake-reddit/src/utils/misc/constants.ts | Various constant values for the web app. <br> "SERVER_URL" is set to `http://localhost:5000` <br> by default. |
4. Start the server.
    - Navigate to the back-end folder and run `npm start`.
    - The console should say something like `Server started at http://localhost:5000`.
5. Start the client.
    - Navigate to the front-end folder and run `npm start`.
    - The console should say something like `Compiled successfully! You can now view fake-reddit in the browser.`

## TODO

-   [ ] Add missing links above.
