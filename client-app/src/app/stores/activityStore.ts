import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity"
import { v4 as uuid } from 'uuid'

export default class ActivityStore {
    activitiesRegestry: Map<string, Activity> = new Map<string, Activity>()
    selectedActivity: Activity | undefined = undefined;
    edtitMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    activitiesByDate = () => {
        return Array.from(this.activitiesRegestry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach((act) => {
                act.date = act.date.split('T')[0];
                activities.push(act);
                this.activitiesRegestry.set(act.id, act);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activitiesRegestry.get(id);
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm(id?: string) {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.edtitMode = true;
    }

    closeForm = () => {
        this.cancelSelectActivity();
        this.edtitMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            activity.id = uuid();
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
                if (this.selectedActivity?.id === id)
                    this.cancelSelectActivity();
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