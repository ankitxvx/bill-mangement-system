import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project';
  showNavbar = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', event.url); // Debug log
        // Show navbar only when not on login or register pages
        this.showNavbar = !['/login', '/register', '/'].includes(event.url);
        console.log('Show navbar:', this.showNavbar); // Debug log
      }
    });
  }
}
