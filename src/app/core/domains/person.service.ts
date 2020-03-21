import {Injectable} from '@angular/core';
import {ResourceService} from '../common';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private rs: ResourceService) {
    this.getPerson();
  }

  getPerson() {
    this.rs
      .get('persons')
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
  }
}
