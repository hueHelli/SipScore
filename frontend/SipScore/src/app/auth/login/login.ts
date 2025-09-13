import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  loginForm!: FormGroup;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Ungültige Angabe';
      this.cdr.detectChanges();
      return;
    } else {
      console.log(this.loginForm);
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', []),
      password: new FormControl('', []),
    });
  }
}
