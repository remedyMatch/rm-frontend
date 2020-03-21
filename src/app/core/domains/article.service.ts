import {Injectable} from '@angular/core';
import {ResourceService} from '../common';
import {Article} from './models/article';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articleSubject: BehaviorSubject<Article>;

  constructor(private rs: ResourceService) {
    this.initArticle();
  }

  get article() {
    return this.articleSubject.asObservable();
  }

  initArticle() {
    this.rs
      .get('artikel/suche')
      .subscribe((res) => {
        const article = res || new Article();
        this.articleSubject.next(article);
      }, (err) => {
        this.articleSubject.next(new Article());
      });
  }
}
