import { HttpClient } from 'aurelia-http-client';
import { autoinject } from "aurelia-framework";
import { Api } from "./apiConfig";

@autoinject
export class PersonApi extends Api {
    constructor(httpClient: HttpClient) {
        super(httpClient, "person");
    }

    getPerson(id: number): Promise<any> {
        return this.get(`${id}`);
    }

    getAllPerson(): Promise<any> {
        return this.getAll();
    }
}