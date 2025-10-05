import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private userService: UserService
  ) {}

  loginForm!: FormGroup;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Ungültige Angabe';
      this.cdr.detectChanges();
      return;
    } else {
      this.httpService
        .login(this.loginForm.value.credential, this.loginForm.value.password)
        .subscribe(
          (res: any) => {
            this.userService.setUser(res.user);
            this.router.navigate(['/home']);
          },
          (err) => {
            this.errorMsg = 'Falscher Benutzername oder Passwort';
            this.cdr.detectChanges();
          }
        );
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  ngOnInit(): void {
    this.httpService.getSession().subscribe((res: any) => {
      if (res.user) {
        this.userService.setUser(res.user);
        this.router.navigate(['/home']);
      }
    });

    this.loginForm = new FormGroup({
      credential: new FormControl('', []),
      password: new FormControl('', []),
    });
  }
}
