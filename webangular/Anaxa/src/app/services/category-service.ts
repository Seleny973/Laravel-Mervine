import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  private authHeaders() {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem('token');
    if (!raw) return {};
    try {
      const token = JSON.parse(raw);
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }

  list() {
    return this.http.get(`${environment.apiUrl}/categories`);
  }

  create(payload: any) {
    return this.http.post(`${environment.apiUrl}/categories`, payload, { headers: this.authHeaders() });
  }

  update(id: number, payload: any) {
    return this.http.put(`${environment.apiUrl}/categories/${id}`, payload, { headers: this.authHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/categories/${id}`, { headers: this.authHeaders() });
  }
}

