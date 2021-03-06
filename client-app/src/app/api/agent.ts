import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { Photo, Profile, UserActivity } from '../models/ActivityAttendee';
import { PaginatedResult } from '../models/pagination';
import User, { ProfilesAboutFormValues, UserFormValues } from '../models/user';
import { store } from '../stores/store';

axios.defaults.baseURL = process.env.REACT_APP_API_URL

const sleep = (delay: number) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const responceBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    if(store.commonStore.jwt)
        config.headers.Authorization = `Bearer ${store.commonStore.jwt}`;
    return config;
})

axios.interceptors.response.use(async response => {
    if(process.env.NODE_ENV === 'development')
        await sleep(1000);
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;}
    return response;    
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch(status){
        case 400:
            if(typeof data === 'string') {
                toast.error(data);
            }
            if(config.method ==='get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if(data.errors)
            {
                const modalStateErrors=[];
                for(const key in data.errors) {
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat()
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            history.push('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
} )

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responceBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responceBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responceBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responceBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params})
        .then(responceBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    put: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {})
}

const Account ={
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {headers:{'Content-type': 'multipart/form-data'}})
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletPhoto: (id: string) => requests.del(`/photos/${id}`),
    updateDetails:(data: ProfilesAboutFormValues) => requests.put(`/profiles`, data),
    udateFolowing: (userName: string ) => requests.post(`/follow/${userName}`, {}),
    listFollowings: (userName: string, predicate: string)=> requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`),
    listActivities: (userName: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${userName}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles,
}

export default agent;