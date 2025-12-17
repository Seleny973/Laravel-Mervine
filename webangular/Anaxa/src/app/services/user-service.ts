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

  private authHeaders() {
    const token = this.tokenSubject.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  setToken(token: string){
    localStorage.setItem('token', JSON.stringify(token));
    this.tokenSubject.next(token);
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password });
  }

  loginAdmin(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login-admin`, { username, password });
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { headers: this.authHeaders() });
  }

  signin(username: string, password: string, email: string) {
    return this.http.post(`${environment.apiUrl}/users`, { username, password, email });
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/users`, { headers: this.authHeaders() });
  }

  createUser(payload: any) {
    return this.http.post(`${environment.apiUrl}/users`, payload, { headers: this.authHeaders() });
  }

  createAdmin(payload: any) {
    return this.http.post(`${environment.apiUrl}/admins`, { ...payload, role: 'admin' }, { headers: this.authHeaders() });
  }

  updateUser(id: number, payload: any) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, payload, { headers: this.authHeaders() });
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`, { headers: this.authHeaders() });
  }

  logout(){
    this.setToken('');
    this.router.navigate(['/']);
  }
}