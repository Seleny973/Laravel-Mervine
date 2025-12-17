import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private userService: UserService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      isAdmin: new FormControl(false)
    });
  }

  ngOnInit(){
    
    // this.userService.getAll().subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   },
    //   error: (error) => {}
    // });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, isAdmin } = this.loginForm.value;
      const call$ = isAdmin
        ? this.userService.loginAdmin(username, password)
        : this.userService.login(username, password);

      call$
      .subscribe({
        next: (response:any) => {
          this.userService.setToken(response.token);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
        }
      });
      // Ici tu peux appeler un service pour créer l'utilisateur
    } else {
      console.log('Formulaire invalide');
      this.loginForm.markAllAsTouched(); // affiche les erreurs
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

}