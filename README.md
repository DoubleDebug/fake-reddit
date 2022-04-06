# fake-reddit-backend

Reddit website clone with React, Typescript and Firebase

## Live preview

(link not available yet)

!(FakeReddit screenshot)[https://i.imgur.com/cj57TeS.png]

## Features

-   Home feed and subreddits
-   Sign in with email/password, Google or GitHub
-   3 types of posts:
    -   Text
    -   Image/video
    -   Poll
-   Upvote/downvote
-   Post comments
-   Inbox & chatting with other redditors
-   Searching for posts

## How to setup locally

0. Install [NodeJS](https://nodejs.org/en/).
1. Clone both [frontend](https://github.com/DoubleDebug/fake-reddit) and backend repositories.
2. Install dependencies in both folders.
    - Run `npm install`
3. Set up environment variables.
    - For backend:
      | File name | Description |
      | --------- | ----------- |
      | back-end/.env | Environment variables such as the client URL, port number, hostname, algolia api key, etc. See an example [here](). |
      | back-end/serviceAccountKey.json | Firebase Admin SDK configuration file. Read more [here](https://firebase.google.com/docs/admin/setup). |
    - For frontend:
      | File name | Description |
      | --------- | ----------- |
      | front-end/.env | Environment variables such as the client URL & server URL. See an example [here](). |
      | front-end/src/utils/firebase/firebaseConfig.ts | Firebase configuration file containing the api key, auth domain, etc. Read more [here](). |
4. Start the server.
    - Navigate to the back-end folder and run `npm start`.
    - The console should say something like `Server started at http://localhost:5000`.
5. Start the client.
    - Navigate to the front-end folder and run `npm start`.
    - The console should say something like `Compiled successfully! You can now view fake-reddit in the browser.`

## TODO

1.  Add missing links above.
