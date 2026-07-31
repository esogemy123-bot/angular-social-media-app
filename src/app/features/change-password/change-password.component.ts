import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, TranslatePipe],
})
export class ChangePasswordComponent {
  msgError: string = '';
  loading: boolean = false;
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  changeSubscribe: Subscription = new Subscription();
  updatePassword() {
    alert('changed');
  }

  changeForm: FormGroup = this.fb.group(
    {
      password: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.confirmPassword },
  );

  confirmPassword(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword && confirmPassword !== '') {
      group.get('confirmPassword')?.setErrors({ missmatch: true });
      return { missmatch: true };
    }
    return null;
  }
  submitForm(): void {
    if (this.changeForm.valid) {
      const { password, newPassword } = this.changeForm.value;
      const modelToSend = { password, newPassword };
      this.loading = true;
      this.changeSubscribe.unsubscribe();
      // logic
      console.log(this.changeForm.value);
      // send data to backend
      this.authService.changePassword(modelToSend).subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res.message);
            // navigate login
            this.router.navigate(['main/feed']);
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
      this.changeForm.markAllAsTouched();
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
