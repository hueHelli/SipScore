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

@Component({
  selector: 'app-verify',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
  constructor(private router: Router) {}

  verfyForm!: FormGroup;
  errorMsg: string | null = null;

  onSubmit() {}

  ngOnInit() {
    console.log(this.router.url.split('/')[2]);
    this.verfyForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
  }
}
