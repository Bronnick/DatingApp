import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private accountService = inject(AccountService)
  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  cancelRegister = output<boolean>()
  protected creds = {} as RegisterCreds
  protected credentialsForm: FormGroup
  protected profileForm: FormGroup
  protected currentStep = signal(1)
  protected validationErrors = signal<string[]>([])

  constructor() {
    this.credentialsForm = this.formBuilder.group({
      email: ['johndoe@test.com', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    this.profileForm = this.formBuilder.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    })

    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  ngOnInit(): void {

  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent
      if (!parent) return null

      const matchValue = parent.get(matchTo)?.value
      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1)
    }
  }

  prevStep() {
    this.currentStep.update(prevStep => prevStep - 1)
  }

  getMaxDate() {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
  }

  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value }
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members')

        },
        error: error => {
          console.error(error)
          this.validationErrors.set(error)
        }
      })
    } 

  }

  cancel() {
    console.log('cancelled')
    this.cancelRegister.emit(false)
  }
}
