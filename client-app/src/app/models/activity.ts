import { act } from "@testing-library/react";
import {Profile} from "./ActivityAttendee";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    isCanceled: boolean;
    attendees: Profile[];
    hostUserName: string;
    isHost: boolean;
    isGoing: boolean;
    host?: Profile;
}

export class Activity implements Activity {
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init);
    }
}

export class ActivityFormValues {
    id? :string = undefined;
    title : string = '';
    date: Date | null = null;
    description: string = '';
    city: string = '';
    venue: string = '';
    category: string = '';
    constructor(activity? : ActivityFormValues) {
        if(activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.city = activity.city;
            this.venue = activity.venue;
            this.category =activity.category
        }
    }
}