import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  customerId: string = 'User';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId from localStorage:', storedUserId); // Debug log
    this.customerId = storedUserId || 'User';
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToPage(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  logout(): void {
    localStorage.removeItem('userId'); // Clear stored customer ID
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}