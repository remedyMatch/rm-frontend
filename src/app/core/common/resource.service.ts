import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(public http: HttpClient) {
  }

  get(path: string, options?): Observable<any> {
    return this.http.get(`${environment.api}/${path}`, options);
  }

  put(path: string, data: object): Observable<any> {
    return this.http.put(`${environment.api}/${path}`, data);
  }

  post(path: string, data: object): Observable<any> {
    return this.http.post(`${environment.api}/${path}`, JSON.stringify(data));
  }

  delete(path: string, id: string | number): Observable<any> {
    return this.http.delete(`${environment.api}/${path}/${id}`);
  }
}
