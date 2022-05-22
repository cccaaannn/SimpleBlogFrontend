import { Visibility } from "./enums/Visibility";
import { Comment } from "./Comment";
import { Category } from "./enums/Category";


interface Post {
    _id: string,
    owner: Owner,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility,
    comments: Comment[],
    createdAt: Date,
    updatedAt: Date
};

interface Owner {
    _id: string,
    username: string
}

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
    visibility?: number,
    createdAt?: number,
    updatedAt?: number
};

export type { Post, PostAdd, PostUpdate, PostSort };