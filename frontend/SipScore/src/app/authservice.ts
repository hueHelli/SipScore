import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  userType: string = '';
  isAuthenticated(): boolean {
    return false;
  }
}
