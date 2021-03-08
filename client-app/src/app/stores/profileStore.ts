import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserActivity } from "../models/ActivityAttendee";
import { ProfilesAboutFormValues } from "../models/user";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;
    followings: Profile[] = []
    loadingFollowings: boolean = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this)
        reaction(() => this.activeTab, activeTab => {
            if (activeTab === 3 || activeTab === 4) {
                const predicate = activeTab === 3 ? 'followers' : 'following';
                this.loadFollowing(predicate)
            }
            else {
                this.followings = [];
            }
        })
    }

    loadUserActivities = async (userName: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const acticvities = await agent.Profiles.listActivities(userName, predicate!);
            runInAction(() => {
                this.userActivities = acticvities;
                this.loadingActivities = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => { this.loadingActivities = false; })
        }
    }


    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile)
            return store.userStore.user.userName === this.profile.userName;
        return false;
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(userName);
            runInAction(() => this.profile = profile)
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.loadingProfile = false })
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.uploading = false)
        }
    }

    setMianPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id == photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.loading = false; })
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletPhoto(photo.id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(x => x.id !== photo.id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.loading = false; })
        }
    }

    updateDetails = async (data: ProfilesAboutFormValues) => {
        this.loading = true;
        try {
            await agent.Profiles.updateDetails(data);
            runInAction(() => {
                if (this.profile) {
                    this.profile.bio = data.bio;
                    this.profile.displayName = data.displayName;
                    store.userStore.setDisplayName(data.displayName);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.loading = false; })
        }
    }

    updateFolowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.udateFolowing(userName);
            store.activityStore.updateAttendeeFolowing(userName);
            runInAction(() => {
                if (this.profile
                    && this.profile.userName !== store.userStore.user?.userName
                    && this.profile.userName === userName) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.userName === store.userStore.user?.userName) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(f => {
                    if (f.userName === userName) {
                        f.following ? f.followersCount-- : f.followersCount++;
                        f.following = !f.following;
                    }
                })
                this.loading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false)
        }
    }

    loadFollowing = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const follwings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() => {
                this.followings = follwings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false)
        }
    }
}