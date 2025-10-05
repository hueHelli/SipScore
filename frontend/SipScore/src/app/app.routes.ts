import { Routes } from '@angular/router';
import { NewRating } from './components/new-rating/new-rating';
import { Home } from './components/home/home';
import { Injectable } from '@angular/core';
import { Authservice } from './services/auth.service';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';
import { Verify } from './components/auth/verify/verify';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verify/:id', component: Verify },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'new-rating', component: NewRating, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
