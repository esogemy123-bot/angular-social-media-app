import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectLangComponent } from '../select-lang/select-lang.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, SelectLangComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  ngOnInit(): void {
    this.loginForm.reset();
  }

  loginForm: FormGroup = this.fb.nonNullable.group({
    // to stay ==> "" ,(don't return null)
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  // loginForm: FormGroup = new FormGroup({
  //   login: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  //   ]),
  // });
  msgError: string = '';
  loading: boolean = false;
  loginSubscribe: Subscription = new Subscription();
  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginSubscribe.unsubscribe();
      // logic
      console.log(this.loginForm.value);
      // send data to backend
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res.message);
            // navigate feed
            // save token local
            localStorage.setItem('socialToken', res.data.token);
            localStorage.setItem('socialUser', JSON.stringify(res.data.user));
            this.router.navigate(['main/feed']);
            console.log('success');
          }
        },
        error: (err: HttpErrorResponse) => {
          // show error
          this.msgError = err.error.message;
          this.loading = false;
          console.log(this.msgError);
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  //
}
