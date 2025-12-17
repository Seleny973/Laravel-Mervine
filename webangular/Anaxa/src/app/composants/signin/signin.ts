import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss']
})
export class Signin {

  signupForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('Pepe', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('pepe@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('qweqweqwe', [Validators.required, Validators.minLength(6)]),
    });
  }

  onInit(){

  }

  onSubmit() {
    console.log(this.signupForm);
    if (this.signupForm.valid) {
      console.log('Formulaire valide:', this.signupForm.value);
      this.userService.signin(this.signupForm.value.username,this.signupForm.value.password, this.signupForm.value.email)
      .subscribe({
        next: (response: any) => {
          console.log('Inscription réussie', response);
          try {
            localStorage.setItem('user', JSON.stringify(response));
          } catch (e) {
            console.warn('Impossible d\'enregistrer user en localStorage', e);
          }
          if (response && response.token) {
            this.userService.setToken(response.token);
          }
          this.router.navigate(['/']);
        },
        error: (error:any) => {
          console.error('Erreur lors de l\'inscription', error);
        }
      });
      // Ici tu peux appeler un service pour créer l'utilisateur
    } else {
      console.log('Formulaire invalide');
      this.signupForm.markAllAsTouched(); // affiche les erreurs
    }
  }

  get username() {
    return this.signupForm.get('username');
  }
}