import { Visibility } from "./enums/Visibility";
import { Comment } from "./Comment";
import { Category } from "./enums/Category";
import { Like } from "./Like";


interface Post {
    _id: string,
    owner: Owner,
    header: string,
    body: string,
    image: string,
    category: Category,
    visibility: Visibility,
    comments: Comment[],
    likes: Like[],
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

export type { Post, PostAdd, PostUpdate };