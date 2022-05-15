interface Comment {
    _id: string,
    owner: Owner,
    comment: string,
    dateCreated: Date
};

interface Owner {
    _id: string,
    username: string
}

interface CommentAdd {
    owner: string,
    comment: string,
};


export type { Comment, CommentAdd };