import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  constructor(private userService: UserService, private router: Router){}

  logout(){
    this.userService.logout().subscribe({
      next: () => {
        this.userService.setToken('');
        this.router.navigate(['/']);
      },
      error: () => {
        this.userService.setToken('');
        this.router.navigate(['/']);
      }
    });
  }
}
