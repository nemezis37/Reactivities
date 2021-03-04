import { Profile } from "./ActivityAttendee";

export default interface User 
{
    userName: string,
    displayName: string,
    token: string,
    email: string,
    image?: string
}

export interface UserFormValues
{
    email: string,
    password: string,
    displayName?: string,
    userName?: string
}

export interface ProfilesAboutFormValues {
    displayName: string;
    bio?: string
}

export class ProfilesAboutFormValues implements ProfilesAboutFormValues{

    displayName: string = '';
    bio? : string ='';
    constructor(profile?: Profile){
        if(!profile)
            return;
        this.bio = profile.bio || '';
        this.displayName = profile.displayName;
    }
}