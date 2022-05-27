import Roles from "./enums/Roles";
import Status from "./enums/Status";

interface User {
    _id: string,
    username: string,
    email: string,
    password: string,
    status: Status,
    role: Roles,
    createdAt: Date,
    updatedAt: Date
};

interface UserAdd {
    username: string,
    email: string,
    password: string
};

interface UserUpdate {
    username: string,
    password?: string
};

export type { User, UserAdd, UserUpdate };