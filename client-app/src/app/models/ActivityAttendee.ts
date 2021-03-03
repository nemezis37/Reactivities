import User from "./user";

export interface ActivityAttendee {
    userName: string,
    bio?: string,
    displayName: string,
    image?: string
}

export class ActivityAttendee implements ActivityAttendee {
    constructor(user: User) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}