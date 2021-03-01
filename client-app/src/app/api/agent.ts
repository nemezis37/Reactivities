import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity } from '../models/activity';
import { store } from '../stores/store';

axios.defaults.baseURL = 'http://localhost:5000/api'

const sleep = (delay: number) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const responceBody = <T>(response: AxiosResponse<T>) => response.data;

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
    create: (activity: Activity) => requests.post('/activities', activity),
    put: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;