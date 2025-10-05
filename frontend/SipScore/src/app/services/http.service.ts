import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:3000/api/';
  apiUser = this.apiUrl + 'user';

  postUser(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) {
    return this.http.post(this.apiUser, {
      firstName,
      lastName,
      email,
      username,
      password,
    });
  }
}
