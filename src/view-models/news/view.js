import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {NewsService} from '../../services/news/news-service';
import {NewsCommentsService} from '../../services/news/news-comments-service';

@inject(NewsService, NewsCommentsService, AuthService)
export class View {
  constructor(newsService, newsCommentsService, authService) {
    this.newsService = newsService;
    this.newsCommentsService = newsCommentsService;
    this.authService = authService;
  }

  activate(params, routeConfig) {
    let user = this.authService.getMe()
      .then(user => {
        this.user = user;
      })
      .catch(() => {
        this.user = null;
      });

    let comments = this.newsCommentsService.getRecent(params.id)
      .then(comments => {
        this.comments = comments;
      })
      .catch(() => {
        this.comments = [];
      });

    let news = this.newsService.get(params.id)
      .then(news => {
        this.news = news;
        routeConfig.navModel.setTitle(news.title);
      })
      .catch(() => {
        this.news = null;
      });

    return Promise.all([user, comments, news]);
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
