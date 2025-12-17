import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  public tokenSubject: BehaviorSubject<String>;


  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tokenSubject = new BehaviorSubject<String>('');
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSubject = new BehaviorSubject<String>(
        JSON.parse(<string>localStorage.getItem('token'))
      );
    }
   }

  public get token(): String {
    return this.tokenSubject.value;
  }

  setToken(token: string){
    localStorage.setItem('token', JSON.stringify(token));
    this.tokenSubject.next(token);
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password });
  }

  signin(username: string, password: string, email: string) {
    return this.http.post(`${environment.apiUrl}/users`, { username, password, email });
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  logout(){
    this.setToken('');
    this.router.navigate(['/']);
  }
}