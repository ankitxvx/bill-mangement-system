import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // For navigation

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  showAck = false;
  registeredUser: any;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize form with validation
    this.registrationForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      countryCode: ['+91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Submit form using async/await and fetch
  async onSubmit() {
    if (this.registrationForm.valid) {
      const customerData = this.registrationForm.value;
      delete customerData.confirmPassword;

      try {
        const response = await fetch('http://localhost:8084/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

        if (!response.ok) {
          throw new Error('Failed to register customer');
        }

        const result = await response.json();
        console.log('Registration response:', result); // Debug log
        
        // Combine form data with response data to ensure we have all fields
        this.registeredUser = {
          ...customerData, // Original form data
          ...result,       // Backend response
          // Map the correct field names from backend response
          userId: result.consumerId || 'Generated after registration',
          title: result.title || customerData.title,
          name: result.customerName || customerData.name, // Use form data since backend returns null
          email: result.email || customerData.email
        };
        this.showAck = true;

        // Hide acknowledgment after 3 seconds and redirect to login
        setTimeout(() => {
          this.showAck = false;
          this.router.navigate(['/login']);
        }, 3000);

      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          alert('Unable to connect to server. Please make sure the backend server is running on port 8084.');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    } else {
      alert('Please correct the errors in the form before submitting.');
    }
  }
// Reset form
  onReset() {
    this.registrationForm.reset();
    this.showAck = false;
  }

  // Navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}