import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { Store } from '@ngrx/store';
import { setIsLoading } from './is-loading.reducers';

@Injectable()
export class ApiService {
  private headers: Headers;
  private options: RequestOptions;


  constructor(
    private http: Http,
    private cookie: CookieService,
    @Inject('ApiUrl') private apiUrl: string
  ) { }

  request(method: string, url: string, data?: Object): Promise<any> {
    // loading

    this.headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': this.cookie.get('csrftoken')
    });
    this.options = new RequestOptions({
      headers: this.headers
    });
    if (!data) {
      const request = this.http[method.toLowerCase()](
         `${this.apiUrl}/${url}`,
          {
            withCredentials: true,
            headers: this.headers
          });

      if (method.toLowerCase() === 'delete') {
        return request.toPromise().catch(this.handleError);
      } else {
        return request.map(res => res.json())
          .toPromise().catch(this.handleError);
      }
    } else {
      return this.http[method.toLowerCase()](
        `${this.apiUrl}/${url}`,
        data,
        this.options)
        .map(res => res.json())
        .toPromise()
        .catch(this.handleError);
    }
  }

  handleError(err) {
      console.log(err);
  }
}
