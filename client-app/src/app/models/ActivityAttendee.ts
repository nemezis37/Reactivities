import User from "./user";

export interface Profile {
    userName: string,
    bio?: string,
    displayName: string,
    image?: string
    followersCount: number,
    followingCount: number,
    following: boolean,
    photos? : Photo[]
}

export class Profile implements Profile {
    constructor(user: User) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo {
    id: string,
    url: string,
    isMain: boolean
}