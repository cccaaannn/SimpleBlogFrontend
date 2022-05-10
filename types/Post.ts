import Visibility from "./enums/Visibility";
import { Comment } from "./Comment";
import Category from "./enums/Category";


interface Post {
    _id: string,
    owner: string,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility,
    comments: Comment[],
    dateCreated: Date
};

interface PostAdd {
    owner: string,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility
};

interface PostUpdate {
    header: string,
    body: string,
    image: string,
    visibility: Visibility
};

interface PostSort {
    visibility?: number
    dateCreated?: number
};

export type { Post, PostAdd, PostUpdate, PostSort };