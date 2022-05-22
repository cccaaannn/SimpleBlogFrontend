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

interface UserSort {
    _id?: number
    username?: number,
    email?: number,
    status?: number,
    role?: number,
    createdAt?: number,
    updatedAt?: number
};

export type { User, UserAdd, UserUpdate,  UserSort };