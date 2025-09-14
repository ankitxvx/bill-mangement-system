import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = 'User';
  // userId: number= localStorage.getItem('userId');

  constructor(private router: Router) {}

  ngOnInit(): void {
    // const storedUsername = localStorage.getItem(userId);
    // this.userId = this.userId ?? 'User';
  }

  
  goToHome(): void {
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  

  goToPage(page: string): void {
    this.router.navigate([`/${page}`]);
  }



  logout(): void {
    localStorage.removeItem('username');
    this.router.navigate(['/login']); 
  }
}
