import { HttpClient } from 'aurelia-http-client';
import { autoinject } from "aurelia-framework";

@autoinject
export class Api {
    private baseUrl: string = "http://localhost:50923/api/"

    constructor(private httpClient: HttpClient, private controller: string) {

    }

    get(action): Promise<any> {
        return this.httpClient.get(`${this.baseUrl}${this.controller}/${action}`);
    }

    getAll(): Promise<any> {
        return this.httpClient.get(`${this.baseUrl}${this.controller}`);
    }
}