import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
  };
  setUser(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    role: string
  ) {
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.email = email;
    this.user.username = username;
    this.user.password = password;
    this.user.role = role;
  }
}
