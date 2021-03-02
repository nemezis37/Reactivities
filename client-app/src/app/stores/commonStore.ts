import { ServerError } from "../models/ServerError";
import {makeAutoObservable, reaction} from "mobx"
import agent from "../api/agent";
import { idText } from "typescript";

export default class CommonStore {
     error: ServerError | null = null
     jwt: string | null = window.localStorage.getItem('jwt')
     appLoadet: boolean = false;

     constructor() {
          makeAutoObservable(this)
          reaction( 
               () => this.jwt,
               token => {
                    if(token)
                         window.localStorage.setItem('jwt', token);
                    else
                         window.localStorage.removeItem('jwt')
               })
     }

     setServerError = (error: ServerError) => {
          this.error = error;
     }

     setJwt =( jwt: string | null) => {
          this.jwt = jwt;
     }

     setAppLoaded = () => {
          this.appLoadet = true;
     }
}