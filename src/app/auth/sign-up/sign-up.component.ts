import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('SIGN UP component called');
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  signup(): void {
    if (this.signupForm.valid) {
      const { email, username, password } = this.signupForm.value;
      this.authService.signUp({ email, password, username }).subscribe({
        next: (response) => {
          if (response.success) {
            this.authService.setAccountId(response.account._id);
            this.snackBar.open('Registration successful, please log in.', 'OK');
            this.router.navigate(['/ui/auth/login']);
          }
        },
        error: (err) => {
          this.snackBar.open(err.error.error.details.join('\n'), 'OK');
        }
      });
    }
  }
}
