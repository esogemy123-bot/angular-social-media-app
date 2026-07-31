export interface Comment {
  _id: string;
  content: string;
  image: string;
  commentCreator: commentCreator;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: Date;
  repliesCount: number;
}
export interface commentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
