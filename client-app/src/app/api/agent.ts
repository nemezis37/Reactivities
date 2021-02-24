import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api'

const sleep = (delay: number) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const responceBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject()
    }
})

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