import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../services/http.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
  constructor(
    private router: Router,
    private httpService: HttpService,
    private userService: UserService
  ) {}

  verfyForm!: FormGroup;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.verfyForm.invalid) {
      this.errorMsg = 'Ungültige Angabe';
      return;
    } else {
      this.httpService
        .verifyMail(
          Number(this.router.url.split('/')[2]),
          this.verfyForm.value.code
        )
        .subscribe(
          (res: any) => {
            // TODO sending user but have to wait until backend is fixed
            console.log(res);
            this.userService.setUser(res.user);
            this.router.navigate(['/home']);
          },
          (err) => {
            this.errorMsg = 'Falscher Code';
          }
        );
    }
  }

  ngOnInit() {
    this.verfyForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
  }
}
