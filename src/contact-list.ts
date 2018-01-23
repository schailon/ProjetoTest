
import { autoinject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactUpdated, ContactViewed } from './messages';
import { PersonApi } from "./personApi";
import { WebAPI } from './web-api';

@autoinject
export class ContactList {
  api: WebAPI;
  personApi: PersonApi;

  contacts;
  selectedId = 0;

  constructor(api: WebAPI, personApi: PersonApi, ea: EventAggregator) {
    this.api = api;
    this.personApi = personApi;

    ea.subscribe(ContactViewed, msg => this.select(msg.contact));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id == id);
      Object.assign(found, msg.contact);
    });
  }

  created() {
    this.personApi.getAllPerson().then(contacts => {
      if (contacts.response) {
        this.contacts = JSON.parse(contacts.response);
      }
      else {
        this.contacts = null;
      }
    });
  }

  select(contact) {
    this.selectedId = contact.id;
    return true;
  }
}
