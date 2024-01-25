import store from "@/Store/store";
import {expire} from "@/Store/Reducers/AuthReducer";
import toast from "react-hot-toast";
import UserUtils from "@/Utils/UserUtils";
import NetworkUtils from "@/Utils/NetworkUtils";
import StringUtils from "@/Utils/StringUtils";
import axios from "axios";

export default class RequestUtils{

    static #expired_checked = false;

    static async get(url, data = {}, headers = {}){
        return await this.request(url, 'GET', data , headers);
    }

    static async apiGet(url, data = {}, headers = {}){
        const result =  await this.request(url, 'GET', data , {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });

        if(result.status > 400)
            throw new Error(result.data.message);

        return result;
    }

    static async post(url, data = {}, headers = {}){
        return await this.request(url, 'POST', data , headers);
    }

    static async apiPost(url, data = {}, headers = {}){
        const result = await this.request(url, 'POST', StringUtils.trimObjectValues(data) , {

            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });

        if(result.status > 400)
            throw new Error(result.data.message);

        return result;
    }

    static async put(url, data = {}, headers = {}){
        return await this.request(url, 'PUT', data, headers);
    }

    static async apiPut(url, data = {}, headers = {}){
        const result = await this.request(url, 'PUT', data, {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });

        if(result.status > 400)
            throw new Error(result.data.message);

        return result;
    }

    static async delete(url, data = {}, headers = {}){
        return await this.request(url, 'DELETE', data, headers);
    }

    static async apiDelete(url, data = {}, headers = {}){
        const result = await this.request(url, 'DELETE', data, {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });

        if(result.status > 400)
            throw new Error(result.data.message);

        return result;
    }

    static async request(url, method, data, headers) {
        let toReturn = {};

        if (url[0] === '/' && NetworkUtils.isLocalhost()) {
            url = 'http://localhost:8000' + url;
        }

        const axiosConfig = {
            method,
            url,
            headers: {
                // 'Content-Type': 'application/json',
                // 'Accept': 'application/json',
                ...headers,
            },
        };

        if (method !== 'GET') {
            axiosConfig.method = 'POST';
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            formData.append('_method', method.toUpperCase());
            axiosConfig.data = formData;
        }
        //if method is put or delete, we need to send the data as form data


        try {
            const response = await axios(axiosConfig);

            if (url[0] === '/' && store.getState().authReducer?.token?.length > 0 && response?.status === 401) {
                store.dispatch(expire());
                if (!this.#expired_checked) {
                    this.#expired_checked = true;
                    setTimeout(() => (this.#expired_checked = false), 1000);
                    toast.error('Your session has expired, please login again');
                }
            }

            toReturn = {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            throw new Error(error?.response?.data?.message || error.message);
        }

        return toReturn;
    }

    static async request_old(url, method, data, headers){

        let toReturn = {};

        if(url[0] === '/' && NetworkUtils.isLocalhost())
            url = 'http://localhost:8000' + url;

        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            ...method !== 'GET' ? {body: JSON.stringify(data)} : {}
        }).catch((error) => {
            toReturn = {
                data: null,
                status: 500,
                error: "server connection error"
            }
        });

        if(url[0] === '/' && store.getState().authReducer?.token?.length > 0 && response?.status === 401){
            store.dispatch(expire());
            if(!this.#expired_checked){
                this.#expired_checked = true;
                setTimeout(() => this.#expired_checked = false, 1000);
                toast.error("Your session has expired, please login again");
            }
        }

        if(response){
            toReturn = {
                data: await response.json(),
                status: response.status
            }
        }
        return toReturn;
    }

    /*static async request(url, method, data, headers){

        let toReturn = {};

        if(url[0] === '/' && NetworkUtils.isLocalhost())
            url = 'http://localhost:8000' + url;

        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            ...method !== 'GET' ? {body: JSON.stringify(data)} : {}
        }).catch((error) => {
            toReturn = {
                data: null,
                status: 500,
                error: "server connection error"
            }
        });

        if(url[0] === '/' && store.getState().authReducer?.token?.length > 0 && response?.status === 401){
            store.dispatch(expire());
            if(!this.#expired_checked){
                this.#expired_checked = true;
                setTimeout(() => this.#expired_checked = false, 1000);
                toast.error("Your session has expired, please login again");
            }
        }

        if(response){
            toReturn = {
                data: await response.json(),
                status: response.status
            }
        }
        return toReturn;
    }*/

}
