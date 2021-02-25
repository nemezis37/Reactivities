import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"


export default class ActivityStore {
    activitiesRegestry: Map<string, Activity> = new Map<string, Activity>()
    selectedActivity: Activity | undefined = undefined;
    edtitMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    activitiesGroupedByDate = () => {
        const dict = this.activitiesByDate().reduce((activities, activity) => {
            const date = activity.date;
            activities[date] = activities[date]? [...activities[date], activity]: [activity];
            return activities;
        }, {} as {[key: string]: Activity[]})
        return Object.entries(dict);
    }

    activitiesByDate = () => {
        return Array.from(this.activitiesRegestry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach((act) => {
                this.setActivityDate(act);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        
        let activity = this.activitiesRegestry.get(id)
        if(activity) {
            this.selectedActivity = activity;
            return activity;
        }else{
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.selectedActivity = activity;
                this.setActivityDate(activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivityDate = (act: Activity) => {
        act.date = act.date.split('T')[0];
        this.activitiesRegestry.set(act.id, act);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activitiesRegestry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.edtitMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.put(activity);
            runInAction(() => {
                this.activitiesRegestry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.edtitMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activitiesRegestry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}