import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';

export class UserModel {
  id: string | undefined;
  lastOnline: Timestamp = Timestamp.now();
  savedPosts: string[] = [];
  username: string = '';
  karma: number = 0;
  cakeDay: Timestamp = Timestamp.now();
  isAdmin?: boolean;
  bio?: string;
  hideNSFW?: boolean;

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
    this.isAdmin = init?.isAdmin ?? false;
    this.bio = init?.bio ?? '';
    this.hideNSFW = init?.hideNSFW ?? false;
  }
}

export const UserConverter = {
  toFirestore(value: WithFieldValue<UserModel>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return new UserModel({ id: snapshot.id, ...snapshot.data(options) });
  },
};
