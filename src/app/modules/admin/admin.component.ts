import {Component, OnInit} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../core/common';
import {ArticleService} from '../../core/domains';
import {Observable} from 'rxjs';
import {Article} from '../../core/domains/models/article';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  model: NgbDateStruct;
  date: { year: number, month: number };

  cartItems$: Observable<Article>;


  constructor(private calendar: NgbCalendar, private modalService: ModalService, private articleService: ArticleService) {
  }

  ngOnInit(): void {
    this.cartItems$ = this.articleService.article;
    this.model = this.calendar.getToday();
  }

  showConfirm() {
    this.modalService.confirm('show confirm', 'confirm');
  }

  showAlert() {
    this.modalService.alert('show alert', 'alert');
  }
}
