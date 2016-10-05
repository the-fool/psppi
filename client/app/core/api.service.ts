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

  // What is the more idiomatic way to do this?
  request(method: string, url: string,
    {data = {}, options = new RequestOptions()} = {data: {}, options: new RequestOptions()}): Promise<any> {
    // loading
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    const requestOptions = new RequestOptions({
      headers: headers,
      withCredentials: true,
    }).merge(options);
    
    let request;
    switch (method.toUpperCase()) {
      case 'GET':
        return this.http[method.toLowerCase()](
          `${this.apiUrl}/${url}`,
          requestOptions).map(res => res.json())
          .toPromise().catch(this.handleError);
      case 'DELETE':
        return request.toPromise().catch(this.handleError);
      default:
        headers.append('Content-Type', 'application/json');
        return this.http[method.toLowerCase()](
          `${this.apiUrl}/${url}`,
          data,
          requestOptions)
          .map(res => res.json())
          .toPromise()
          .catch(this.handleError);
    }
  }

  handleError(err) {
    console.log(err);
  }
}
