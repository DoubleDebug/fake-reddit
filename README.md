# FakeReddit

Fake Reddit is a reddit website clone made with React, Typescript and Firebase.<br>
Live preview: [https://fake-reddit.com](https://fake-reddit.com)

![FakeReddit screenshot](https://i.imgur.com/O3OPruB.png)

## Features

-   Home feed and custom user feed
-   Subreddits
-   Sign in with email/password, Google or GitHub
-   3 types of posts:
    -   Text
    -   Image/video
    -   Poll
-   Upvote/downvote posts
-   Post comments
-   Inbox & chatting with other redditors
-   Searching for posts
-   Account and profile settings

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
      | fake-reddit-backend/.env | Environment variables such as the client URL, <br> port number, hostname, algolia api key, etc. <br> See an example [here](https://github.com/DoubleDebug/fake-reddit-backend/blob/master/docs/environment-config-templates/.env). |
      | fake-reddit-backend/serviceAccountKey.json | Firebase Admin SDK configuration file. <br> Read more [here](https://firebase.google.com/docs/admin/setup). See an example [here](https://github.com/DoubleDebug/fake-reddit-backend/blob/master/docs/environment-config-templates/serviceAccountKey.json) |
    - Front-end:
      | File name | Description |
      | --------- | ----------- |
      | fake-reddit/src/utils/firebase/firebaseConfig.ts | Firebase configuration file containing the api key, <br> auth domain, etc. Read more [here](https://firebase.google.com/docs/web/setup). See an example [here](https://github.com/DoubleDebug/fake-reddit/blob/master/src/utils/firebase/firebaseConfig.ts). |
      | fake-reddit/src/utils/misc/constants.ts | Various application constants. <br> "SERVER_URL" is set to `http://localhost:5000` <br> by default. See an example [here](https://github.com/DoubleDebug/fake-reddit/blob/master/src/utils/misc/constants.ts). |
4. Start the server.
    - Navigate to the back-end folder and run `npm start`.
    - The console should say `Server started at http://localhost:5000`.
5. Start the client.
    - Navigate to the front-end folder and run `npm start`.
    - The console should say `Compiled successfully! You can now view fake-reddit in the browser.`

## Things I would change if I were to start over

1. Have more consistent CSS styles.
    - Use Material UI components for everything.
    - Make it easy to add more themes later on (dark/light/system).
    - Make it responsive for mobile devices from the beginning.
2. Pay attention to accessibility.
3. Use a CDN instead of storing raw files in the Firebase Storage bucket.

## TODO

-   [x] Add missing links above.
-   [ ] Make it responsive and mobile friendly.
-   [ ] Change post requirements to be same as the real reddit website.
-   [ ] Fetch only last x comments, instead of fetching all of them.
-   [ ] Fetch only last x messages, instead of fetching all of them.
