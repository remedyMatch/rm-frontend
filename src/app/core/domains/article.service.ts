import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {ResourceService} from '../common';
import {Article} from './models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articleSubject: BehaviorSubject<Article>;

  constructor(private rs: ResourceService) {

  }

  get article() {
    return this.articleSubject.asObservable();
  }

  searchArticle() {
    this.rs
      .get('artikel/suche')
      .subscribe((res) => {
        const article = res || new Article();
        this.articleSubject.next(article);
      }, (err) => {
        this.articleSubject.next(new Article());
      });
  }

  createArticle(article: Article) {
    this.rs
      .post(`artikel/${article.key}`, article)
      .subscribe(res => {
        console.log(res);
      });
  }

  getArticle(articleId: string) {
    this.rs.get(`artikel/${articleId}`)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
