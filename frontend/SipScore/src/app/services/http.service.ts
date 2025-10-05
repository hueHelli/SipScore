import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:3000/api/';
  apiUser = this.apiUrl + 'users';
  apiSession = this.apiUrl + 'sessions';

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

  verifyMail(insertId: number, code: number) {
    return this.http.put(this.apiUser + '/' + insertId, {
      request: { code: code },
      action: 'verify',
    });
  }

  login(credential: string, password: string) {
    return this.http.post(
      this.apiSession,
      { credential, password },
      { withCredentials: true }
    );
  }

  getSession() {
    return this.http.get(this.apiSession, { withCredentials: true });
  }
}
