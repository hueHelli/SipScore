import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: null,
  };

  private usernameSubject = new BehaviorSubject<string | null>(null);

  setUser(user: {
    Benutzer_Id: number;
    Benutzername: string;
    Code: number;
    Email: string;
    Geloscht: number;
    Nachname: string;
    Rolle: any;
    Verifiziert: number;
    Vorname: string;
  }) {
    this.user.firstName = user.Vorname;
    this.user.lastName = user.Nachname;
    this.user.email = user.Email;
    this.user.username = user.Benutzername;
    this.user.role = user.Rolle.data;

    this.usernameSubject.next(this.user.username);
  }

  clearUser() {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      role: null,
    };
    this.usernameSubject.next(null);
  }

  getUserRole() {
    return this.user.role;
  }

  getUserName(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }
}
