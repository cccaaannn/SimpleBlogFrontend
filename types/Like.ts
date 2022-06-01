interface Like {
    _id: string,
    owner: string,
    createdAt: Date,
    updatedAt: Date
};

interface LikeAdd {
    owner: string
};


export type { Like, LikeAdd };