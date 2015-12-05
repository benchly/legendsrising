import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class NewsService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  getRecent() {
    return this.httpClient.fetch('/news')
      .then(response => response.json());
  }

  get(id) {
    return this.httpClient.fetch('/news/' + id)
      .then(response => response.json());
  }
}