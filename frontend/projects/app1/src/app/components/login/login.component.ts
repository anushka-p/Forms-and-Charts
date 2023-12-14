import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loggedUser: string = '';
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('token', token);
        const decodedToken: any = jwtDecode(token);

        // Extract user role (assuming it's stored in a field called 'role')
        const userRole = decodedToken.role;

        // Redirect based on user role
        if (token !== null) {
          if (userRole === 'admin') {
            this.loggedUser = 'admin';
            this.router.navigate(['app1/home/admin-home']);
          } else if (userRole === 'user') {
            this.loggedUser = 'user';
            this.router.navigate(['app1/home/user-home']);
          } else {
            //error
          }
          // Redirect or perform further actions
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error.message || 'An Error Occurred';
      },
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['access_token'];
      // Now you can use the access token in your component
      console.log('Access Token:', accessToken);
    });
  }
  handleClose() {
    this.errorMessage = '';
  }
  googleLogin() {}
}
