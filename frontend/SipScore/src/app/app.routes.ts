import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { NewRating } from './components/new-rating/new-rating';
import { Home } from './components/home/home';
import { Injectable } from '@angular/core';
import { Authservice } from './services/auth.service';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';
import { Verify } from './components/auth/verify/verify';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: Authservice, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated(); // Implement this method in your AuthService
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }
    return isAuthenticated;
  }
}

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verify/:id', component: Verify },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'new-rating', component: NewRating, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
