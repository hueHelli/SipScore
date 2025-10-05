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
    role: null,
  };
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
  }

  getUserRole() {
    return this.user.role;
  }
}
