/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as SignUpImport } from './routes/sign-up';
import { Route as NewSubredditImport } from './routes/new-subreddit';
import { Route as NewPostImport } from './routes/new-post';
import { Route as LoginImport } from './routes/login';
import { Route as InboxImport } from './routes/inbox';
import { Route as IndexImport } from './routes/index';
import { Route as UserUsernameImport } from './routes/user.$username';
import { Route as RIdImport } from './routes/r.$id';
import { Route as PostIdImport } from './routes/post.$id';
import { Route as LoginResetPasswordImport } from './routes/login.reset-password';
import { Route as InboxRoomIdImport } from './routes/inbox.$roomId';
import { Route as UserUsernameEditImport } from './routes/user.$username.edit';

// Create/Update Routes

const SignUpRoute = SignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any);

const NewSubredditRoute = NewSubredditImport.update({
  id: '/new-subreddit',
  path: '/new-subreddit',
  getParentRoute: () => rootRoute,
} as any);

const NewPostRoute = NewPostImport.update({
  id: '/new-post',
  path: '/new-post',
  getParentRoute: () => rootRoute,
} as any);

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any);

const InboxRoute = InboxImport.update({
  id: '/inbox',
  path: '/inbox',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const UserUsernameRoute = UserUsernameImport.update({
  id: '/user/$username',
  path: '/user/$username',
  getParentRoute: () => rootRoute,
} as any);

const RIdRoute = RIdImport.update({
  id: '/r/$id',
  path: '/r/$id',
  getParentRoute: () => rootRoute,
} as any);

const PostIdRoute = PostIdImport.update({
  id: '/post/$id',
  path: '/post/$id',
  getParentRoute: () => rootRoute,
} as any);

const LoginResetPasswordRoute = LoginResetPasswordImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => LoginRoute,
} as any);

const InboxRoomIdRoute = InboxRoomIdImport.update({
  id: '/$roomId',
  path: '/$roomId',
  getParentRoute: () => InboxRoute,
} as any);

const UserUsernameEditRoute = UserUsernameEditImport.update({
  id: '/edit',
  path: '/edit',
  getParentRoute: () => UserUsernameRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/inbox': {
      id: '/inbox';
      path: '/inbox';
      fullPath: '/inbox';
      preLoaderRoute: typeof InboxImport;
      parentRoute: typeof rootRoute;
    };
    '/login': {
      id: '/login';
      path: '/login';
      fullPath: '/login';
      preLoaderRoute: typeof LoginImport;
      parentRoute: typeof rootRoute;
    };
    '/new-post': {
      id: '/new-post';
      path: '/new-post';
      fullPath: '/new-post';
      preLoaderRoute: typeof NewPostImport;
      parentRoute: typeof rootRoute;
    };
    '/new-subreddit': {
      id: '/new-subreddit';
      path: '/new-subreddit';
      fullPath: '/new-subreddit';
      preLoaderRoute: typeof NewSubredditImport;
      parentRoute: typeof rootRoute;
    };
    '/sign-up': {
      id: '/sign-up';
      path: '/sign-up';
      fullPath: '/sign-up';
      preLoaderRoute: typeof SignUpImport;
      parentRoute: typeof rootRoute;
    };
    '/inbox/$roomId': {
      id: '/inbox/$roomId';
      path: '/$roomId';
      fullPath: '/inbox/$roomId';
      preLoaderRoute: typeof InboxRoomIdImport;
      parentRoute: typeof InboxImport;
    };
    '/login/reset-password': {
      id: '/login/reset-password';
      path: '/reset-password';
      fullPath: '/login/reset-password';
      preLoaderRoute: typeof LoginResetPasswordImport;
      parentRoute: typeof LoginImport;
    };
    '/post/$id': {
      id: '/post/$id';
      path: '/post/$id';
      fullPath: '/post/$id';
      preLoaderRoute: typeof PostIdImport;
      parentRoute: typeof rootRoute;
    };
    '/r/$id': {
      id: '/r/$id';
      path: '/r/$id';
      fullPath: '/r/$id';
      preLoaderRoute: typeof RIdImport;
      parentRoute: typeof rootRoute;
    };
    '/user/$username': {
      id: '/user/$username';
      path: '/user/$username';
      fullPath: '/user/$username';
      preLoaderRoute: typeof UserUsernameImport;
      parentRoute: typeof rootRoute;
    };
    '/user/$username/edit': {
      id: '/user/$username/edit';
      path: '/edit';
      fullPath: '/user/$username/edit';
      preLoaderRoute: typeof UserUsernameEditImport;
      parentRoute: typeof UserUsernameImport;
    };
  }
}

// Create and export the route tree

interface InboxRouteChildren {
  InboxRoomIdRoute: typeof InboxRoomIdRoute;
}

const InboxRouteChildren: InboxRouteChildren = {
  InboxRoomIdRoute: InboxRoomIdRoute,
};

const InboxRouteWithChildren = InboxRoute._addFileChildren(InboxRouteChildren);

interface LoginRouteChildren {
  LoginResetPasswordRoute: typeof LoginResetPasswordRoute;
}

const LoginRouteChildren: LoginRouteChildren = {
  LoginResetPasswordRoute: LoginResetPasswordRoute,
};

const LoginRouteWithChildren = LoginRoute._addFileChildren(LoginRouteChildren);

interface UserUsernameRouteChildren {
  UserUsernameEditRoute: typeof UserUsernameEditRoute;
}

const UserUsernameRouteChildren: UserUsernameRouteChildren = {
  UserUsernameEditRoute: UserUsernameEditRoute,
};

const UserUsernameRouteWithChildren = UserUsernameRoute._addFileChildren(
  UserUsernameRouteChildren,
);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/inbox': typeof InboxRouteWithChildren;
  '/login': typeof LoginRouteWithChildren;
  '/new-post': typeof NewPostRoute;
  '/new-subreddit': typeof NewSubredditRoute;
  '/sign-up': typeof SignUpRoute;
  '/inbox/$roomId': typeof InboxRoomIdRoute;
  '/login/reset-password': typeof LoginResetPasswordRoute;
  '/post/$id': typeof PostIdRoute;
  '/r/$id': typeof RIdRoute;
  '/user/$username': typeof UserUsernameRouteWithChildren;
  '/user/$username/edit': typeof UserUsernameEditRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/inbox': typeof InboxRouteWithChildren;
  '/login': typeof LoginRouteWithChildren;
  '/new-post': typeof NewPostRoute;
  '/new-subreddit': typeof NewSubredditRoute;
  '/sign-up': typeof SignUpRoute;
  '/inbox/$roomId': typeof InboxRoomIdRoute;
  '/login/reset-password': typeof LoginResetPasswordRoute;
  '/post/$id': typeof PostIdRoute;
  '/r/$id': typeof RIdRoute;
  '/user/$username': typeof UserUsernameRouteWithChildren;
  '/user/$username/edit': typeof UserUsernameEditRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/inbox': typeof InboxRouteWithChildren;
  '/login': typeof LoginRouteWithChildren;
  '/new-post': typeof NewPostRoute;
  '/new-subreddit': typeof NewSubredditRoute;
  '/sign-up': typeof SignUpRoute;
  '/inbox/$roomId': typeof InboxRoomIdRoute;
  '/login/reset-password': typeof LoginResetPasswordRoute;
  '/post/$id': typeof PostIdRoute;
  '/r/$id': typeof RIdRoute;
  '/user/$username': typeof UserUsernameRouteWithChildren;
  '/user/$username/edit': typeof UserUsernameEditRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | '/'
    | '/inbox'
    | '/login'
    | '/new-post'
    | '/new-subreddit'
    | '/sign-up'
    | '/inbox/$roomId'
    | '/login/reset-password'
    | '/post/$id'
    | '/r/$id'
    | '/user/$username'
    | '/user/$username/edit';
  fileRoutesByTo: FileRoutesByTo;
  to:
    | '/'
    | '/inbox'
    | '/login'
    | '/new-post'
    | '/new-subreddit'
    | '/sign-up'
    | '/inbox/$roomId'
    | '/login/reset-password'
    | '/post/$id'
    | '/r/$id'
    | '/user/$username'
    | '/user/$username/edit';
  id:
    | '__root__'
    | '/'
    | '/inbox'
    | '/login'
    | '/new-post'
    | '/new-subreddit'
    | '/sign-up'
    | '/inbox/$roomId'
    | '/login/reset-password'
    | '/post/$id'
    | '/r/$id'
    | '/user/$username'
    | '/user/$username/edit';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  InboxRoute: typeof InboxRouteWithChildren;
  LoginRoute: typeof LoginRouteWithChildren;
  NewPostRoute: typeof NewPostRoute;
  NewSubredditRoute: typeof NewSubredditRoute;
  SignUpRoute: typeof SignUpRoute;
  PostIdRoute: typeof PostIdRoute;
  RIdRoute: typeof RIdRoute;
  UserUsernameRoute: typeof UserUsernameRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  InboxRoute: InboxRouteWithChildren,
  LoginRoute: LoginRouteWithChildren,
  NewPostRoute: NewPostRoute,
  NewSubredditRoute: NewSubredditRoute,
  SignUpRoute: SignUpRoute,
  PostIdRoute: PostIdRoute,
  RIdRoute: RIdRoute,
  UserUsernameRoute: UserUsernameRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/inbox",
        "/login",
        "/new-post",
        "/new-subreddit",
        "/sign-up",
        "/post/$id",
        "/r/$id",
        "/user/$username"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/inbox": {
      "filePath": "inbox.tsx",
      "children": [
        "/inbox/$roomId"
      ]
    },
    "/login": {
      "filePath": "login.tsx",
      "children": [
        "/login/reset-password"
      ]
    },
    "/new-post": {
      "filePath": "new-post.tsx"
    },
    "/new-subreddit": {
      "filePath": "new-subreddit.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/inbox/$roomId": {
      "filePath": "inbox.$roomId.tsx",
      "parent": "/inbox"
    },
    "/login/reset-password": {
      "filePath": "login.reset-password.tsx",
      "parent": "/login"
    },
    "/post/$id": {
      "filePath": "post.$id.tsx"
    },
    "/r/$id": {
      "filePath": "r.$id.tsx"
    },
    "/user/$username": {
      "filePath": "user.$username.tsx",
      "children": [
        "/user/$username/edit"
      ]
    },
    "/user/$username/edit": {
      "filePath": "user.$username.edit.tsx",
      "parent": "/user/$username"
    }
  }
}
ROUTE_MANIFEST_END */
