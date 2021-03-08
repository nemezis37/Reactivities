import { makeAutoObservable, reaction, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity"
import {format} from 'date-fns'
import { store } from "./store";
import { Profile } from "../models/ActivityAttendee";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
    activitiesRegestry: Map<string, Activity> = new Map<string, Activity>()
    selectedActivity: Activity | undefined = undefined;
    edtitMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination| null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this)
        reaction( () => this.predicate.keys(), 
        () => {
            this.pagingParams = new PagingParams();
            this.activitiesRegestry.clear();
            this.loadActivities();
        })
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    get axiosParams () {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumnber.toString())
        params.append('pageSize', this.pagingParams.pageSize.toString())
        this.predicate.forEach((value, key) => {
            if(key === 'startDate')
                params.append(key, (value as Date).toISOString())
            else
                params.append(key, value);
        })
        return params;
    }

    setPredicate = (predicate: string, value: string | Date)  => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if(key !== 'startDate')
                    this.predicate.delete(key);
            })
        }
        switch(predicate) {
            case 'all': 
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing': 
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost': 
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate': 
                this.predicate.delete('startDate')
                this.predicate.set('startDate', value);
                break;
        }
    }

    activitiesGroupedByDate = () => {
        const dict = this.activitiesByDate().reduce((activities, activity) => {
            const date = format(activity.date!, 'dd MMM yyyy');
            activities[date] = activities[date]? [...activities[date], activity]: [activity];
            return activities;
        }, {} as {[key: string]: Activity[]})
        return Object.entries(dict);
    }

    activitiesByDate = () => {
        return Array.from(this.activitiesRegestry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime())
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const paginatedResult = await agent.Activities.list(this.axiosParams);
            paginatedResult.data.forEach((act) => {
                this.setActivity(act);
            });
            this.setPagination(paginatedResult.pagination)
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) =>{
        this.pagination = pagination;
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
                this.setActivity(activity!);
                runInAction(()=>{
                    this.selectedActivity = activity;
                })
                return activity;
            } catch (error) {
                console.log(error);
            }
            finally{
                this.setLoadingInitial(false)
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activitiesRegestry.get(id);
    }

    private setActivity = (act: Activity) => {
        act.date = new Date(act.date!);
        act.isHost = store.userStore.user?.userName === act.hostUserName;
        act.isGoing = act.attendees?.some(x => x.userName === store.userStore.user?.userName);
        act.host=act.attendees?.find(x => x.userName == act.hostUserName); 
        this.activitiesRegestry.set(act.id, act);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    createActivity = async (activityFormValues: ActivityFormValues) => {
        try {
            await agent.Activities.create(activityFormValues);
            const newActivity = new Activity(activityFormValues);
            const user = store.userStore.user;
            const attendee = new Profile(user!)
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activityFormValues: ActivityFormValues) => {
        try {
            await agent.Activities.put(activityFormValues);
            runInAction(() => {
                if(activityFormValues.id) {
                    const updatedActivity = {...this.getActivity(activityFormValues.id), ...activityFormValues} as Activity;
                    this.activitiesRegestry.set(activityFormValues.id, updatedActivity);
                    this.selectedActivity = updatedActivity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    attend = async () => {
        const user = store.userStore.user;
        try{
            this.loading = true;
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.userName !== user?.userName);
                    this.selectedActivity!.isGoing = false;}
                else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
            })
        }catch(error){
            console.log(error);
        }
        finally{
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

    toggleActivityCanceled = async () => {
        this.loading = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            this.selectedActivity!.isCanceled = !this.selectedActivity!.isCanceled;
            this.activitiesRegestry.set(this.selectedActivity!.id, this.selectedActivity!)
        }catch(error){
            console.log(error);
            }finally{
            runInAction(() => {this.loading = false;})
        }
    }

    clearSeectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFolowing = (userName: string) => {
        this.activitiesRegestry.forEach(a => 
           { a.attendees.forEach(attendee => {
                if(attendee.userName === userName) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following
                }
            })})
    }

}