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
      username: new FormControl('johnd', [Validators.required]),
      password: new FormControl('m38rmF$', [Validators.required, Validators.minLength(6)]),
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
    console.log(this.loginForm);
    if (this.loginForm.valid) {
      // console.log('Formulaire valide:', this.loginForm.value);
      this.userService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (response:any) => {
          console.log('Connexion réussie', response);
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