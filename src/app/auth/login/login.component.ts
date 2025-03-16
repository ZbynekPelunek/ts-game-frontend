import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private charCreateService: CharacterCreateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    // TODO remove signUp()
    this.charCreateService.setCharCreatingValue(true);
    this.authService.signUp();
    if (this.loginForm.valid) {
      // this.authService.login();
      // const credentials = this.loginForm.value;
      // this.authService.login(credentials).subscribe(
      //   (response) => {
      //     console.log('Login successful', response);
      //     // Further processing, e.g., navigation
      //   },
      //   (error) => {
      //     console.error('Login error', error);
      //     // Error handling here
      //   }
      // );
    }
  }
}
