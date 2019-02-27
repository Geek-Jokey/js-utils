import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';

@Injectable()
export abstract class RestService {

  private api_url = environment.api_url;
  private order_api_url = environment.order_api_url;

  constructor(private http: HttpClient) {
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json',
      'itacasa-access-token': environment.access_token,
      'itacasa-api-version': environment.api_version
    });
  }

  get(relativeUrl: string): Observable<any> {
    return this.http.get(relativeUrl, {
      headers: this.headers,
    });
  }

  request(service: string, params?: object): Promise<object> {
    const access_token = environment.access_token;
    this.post(this.api_url, {
      service: 'user.check.token',
      params: {
        access_token: access_token,
      }
    }).then(data => {
      const flag = data['enable'];
      if (!flag) {
        location.href = environment.logout;
      }
    }, error => {
      console.log(error);
    });
    return this.post(this.api_url, {
      service,
      params: {
        access_token: access_token,
        ...params
      }
    });
  }

  orderRequest(relativeUrl: string, params: any): Promise<object> {
    return this.post(this.order_api_url + relativeUrl, params);
  }

  private post(url: string, params: any): Promise<object> {
    return new Promise((resolve, reject) => {
      this.http.post(url, params, {
        headers: this.headers,
      }).subscribe( data => {
        if (data['code'] === 0) {
          resolve(data['content']);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }
}
