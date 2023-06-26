import store from "@/Store/store";
import {expire} from "@/Store/Reducers/AuthReducer";
import toast from "react-hot-toast";
import UserUtils from "@/Utils/UserUtils";
import NetworkUtils from "@/Utils/NetworkUtils";

export default class RequestUtils{

    static #expired_checked = false;

    static async get(url, data = {}, headers = {}){
        return await this.request(url, 'GET', data , headers);
    }

    static async apiGet(url, data = {}, headers = {}){
        return await this.request(url, 'GET', data , {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });
    }

    static async post(url, data = {}, headers = {}){
        return await this.request(url, 'POST', data , headers);
    }

    static async apiPost(url, data = {}, headers = {}){
        return await this.request(url, 'POST', data , {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });
    }

    static async put(url, data = {}, headers = {}){
        return await this.request(url, 'PUT', data, headers);
    }

    static async apiPut(url, data = {}, headers = {}){
        return await this.request(url, 'PUT', data, {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });
    }

    static async delete(url, data = {}, headers = {}){
        return await this.request(url, 'DELETE', data, headers);
    }

    static async apiDelete(url, data = {}, headers = {}){
        return await this.request(url, 'DELETE', data, {
            ...headers,
            'Authorization': 'Bearer ' + UserUtils.getUserToken(),
        });
    }

    static async request(url, method, data, headers){

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

}
