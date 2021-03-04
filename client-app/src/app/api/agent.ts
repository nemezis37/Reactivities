import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { Photo, Profile } from '../models/ActivityAttendee';
import User, { UserFormValues } from '../models/user';
import { store } from '../stores/store';

axios.defaults.baseURL = 'http://localhost:5000/api'

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
    await sleep(1000);
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
    list: () => requests.get<Activity[]>('/activities'),
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
    deletPhoto: (id: string) => requests.del(`/photos/${id}`)

}

const agent = {
    Activities,
    Account,
    Profiles,
}

export default agent;