
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import { ContactUpdated, ContactViewed } from './messages';
import { areEqual } from './utility';
import { PersonApi } from "./personApi";
import { WebAPI } from './web-api';

interface Phone {
  id: number;
  number: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
}

@autoinject
export class ContactDetail {
  routeConfig;
  personApi: PersonApi;
  webApi: WebAPI;
  contact: Contact;
  originalContact: Contact;
  ea: EventAggregator;

  constructor(webApi: WebAPI, personApi: PersonApi, ea: EventAggregator) {
    this.personApi = personApi;
    this.webApi = webApi
    this.ea = ea;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.personApi.get(params.id).then(contact => {
      if (contact.response) {
        this.contact = <Contact>JSON.parse(contact.response);
      }
      else {
        this.contact = null;
        this.routeConfig.navModel.setTitle(this.contact.firstName);
      }

      this.originalContact = JSON.parse(JSON.stringify(this.contact));
      this.ea.publish(new ContactViewed(this.contact));
      this.webApi.isRequesting = false;
    });
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.webApi.isRequesting;
  }

  save() {
    this.webApi.saveContact(this.contact).then(contact => {
      this.contact = <Contact>contact;
      this.routeConfig.navModel.setTitle(this.contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(this.contact));
      this.ea.publish(new ContactUpdated(this.contact));
    });
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ContactViewed(this.contact));
      }

      return result;
    }

    return true;
  }
}