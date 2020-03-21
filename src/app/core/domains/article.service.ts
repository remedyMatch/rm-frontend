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
    console.log('test');
    this.rs
      .get('artikel/suche')
      .subscribe((res) => {
        const article = res || null;
        this.articleSubject.next(article);
      }, (err) => {
        this.articleSubject.next(null);
      });
  }
}
