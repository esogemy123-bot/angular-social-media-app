import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectLangComponent } from '../select-lang/select-lang.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe, SelectLangComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  msgError: string = '';
  loading: boolean = false;
  registerSubscribe: Subscription = new Subscription();

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl('', Validators.pattern(/^[a-z0-9_]{3,30}$/)),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    { validators: this.confirmPassword },
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.registerSubscribe.unsubscribe();
      // logic
      console.log(this.registerForm.value);
      // send data to backend
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res.message);
            // navigate login
            this.router.navigate(['auth/login']);
          }
        },
        error: (err: HttpErrorResponse) => {
          // show error
          this.msgError = err.error.message;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  showPassword(element: HTMLInputElement): void {
    if (element.type === 'password') {
      element.type = 'text';
      return;
    }
    element.type = 'password';
  }
  showRePassword(element: HTMLInputElement): void {
    if (element.type === 'password') {
      element.type = 'text';
      return;
    }
    element.type = 'password';
  }
}
