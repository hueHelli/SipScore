import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService
  ) {}

  signupForm!: FormGroup;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.signupForm.invalid) {
      this.errorMsg = 'Ungültige Angabe';
      this.cdr.detectChanges();
      return;
    } else {
      this.httpService
        .postUser(
          this.signupForm.value.firstName,
          this.signupForm.value.lastName,
          this.signupForm.value.email,
          this.signupForm.value.username,
          this.signupForm.value.password
        )
        .subscribe(
          (res: any) => {
            // Have to wait for backend bc the backend guy fucked up
            // (he gave me a text as respone like "User created with id 14" instead of a json with the id)
            // such a idiot
            // Okay now i can carry on ;) thx backend guy
            this.router.navigate(['/verify/' + res.id]);
          },
          (err) => {}
        );
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator() {
    if (
      this.signupForm &&
      this.signupForm.get('password')?.value !==
        this.signupForm.get('confirmPassword')?.value
    ) {
      return { mismatch: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.required,
        this.passwordMatchValidator.bind(this),
      ]),
    });
  }
}
