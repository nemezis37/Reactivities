import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import User, { UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    logIn = async (user: UserFormValues) => {
        try {
            const logedInUser =  await agent.Account.login(user)
            store.commonStore.setJwt(logedInUser.token);
            runInAction(()=> this.user = logedInUser)
            history.push('/activities')
            store.modalStore.closeModal()
        } catch (error) {
            throw error;
        }
    }

    register = async (user: UserFormValues) => {
        try {
            const logedInUser =  await agent.Account.register(user)
            store.commonStore.setJwt(logedInUser.token);
            runInAction(()=> this.user = logedInUser)
            history.push('/activities')
            store.modalStore.closeModal()
        } catch (error) {
            throw error;
        }
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user)
        } catch (error) {
            console.log(error)
        }
    }

    logout = () => {
        this.user = null;
        store.commonStore.setJwt(null)
        window.localStorage.removeItem('jwt');
        history.push('/');
    }
    
    setImage = (image: string) => {
        if(this.user)
            this.user.image = image;
    }

    setDisplayName = (displayName: string) => {
        if(this.user)
            this.user.displayName = displayName;
    }
}