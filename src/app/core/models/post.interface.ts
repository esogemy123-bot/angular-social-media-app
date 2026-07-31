export interface Post {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: user;
  sharedPost: null;
  likes: any[];
  createdAt: Date;
  commentsCount: number;
  topComment: null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}
export interface user {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
