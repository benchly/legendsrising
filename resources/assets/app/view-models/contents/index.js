import {inject} from 'aurelia-framework';
import {NewsService} from '../../services/news/news-service';

@inject(NewsService)
export class Index {
  news = [];

  constructor(newsService) {
    this.newsService = newsService;
  }

  activate() {
    return this.newsService.getRecent()
      .then(news => this.news = news);
  }
}
