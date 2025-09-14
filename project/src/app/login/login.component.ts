import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      this.successMessage = '';
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const response = await fetch('http://localhost:8084/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      this.successMessage = 'Login successful!';
      this.errorMessage = '';
      localStorage.setItem('userId', data.consumerId); // Fixed: use consumerId instead of customerId
      
      // Redirect to home page after successful login
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        this.errorMessage = 'Unable to connect to server. Please make sure the backend server is running on port 8084.';
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
      this.successMessage = '';
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

