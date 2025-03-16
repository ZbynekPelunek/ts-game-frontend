import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private charCreateService: CharacterCreateService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
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
      this.charCreateService.setCharCreatingValue(true);
      this.authService.signUp();
      // const registrationData = this.signupForm.value;
      // this.authService.signup(registrationData).subscribe(
      //   (response) => {
      //     console.log('Sign up successful', response);
      //     // Additional navigation or messages can go here
      //   },
      //   (error) => {
      //     console.error('Sign up error', error);
      //     // Handle errors as needed
      //   }
      // );
    }
  }
}
