import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  public cart: Array<{ product: any; quantity: number }> = [];
  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = JSON.parse(<string>localStorage.getItem('cart')) || [];
      // normalize stored cart to expected shape
      this.cart = raw.map((item: any) => {
        if (item && item.product && typeof item.quantity === 'number') return item;
        // legacy format: stored as array of products
        return { product: item, quantity: 1 };
      });
      if (!this.cart) {
        localStorage.setItem('cart', JSON.stringify([]));
        this.cart = [];
      }
    } else {
      // SSR fallback: pas de localStorage
      this.cart = [];
    }
    console.log(this.cart);
  }

  getProducts() {
    return this.http.get(`${environment.apiUrl}/products`);
  }

  createProduct(payload: any) {
    return this.http.post(`${environment.apiUrl}/products`, payload, { headers: this.authHeaders() });
  }

  updateProduct(productId: number, payload: any){
    return this.http.put(`${environment.apiUrl}/products/${productId}`, payload, { headers: this.authHeaders() });
  }

  deleteProductRemote(productId: number){
    // Call the Laravel API to delete product
    return this.http.delete(`${environment.apiUrl}/products/${productId}`, { headers: this.authHeaders() });
  }

  addToCart(product: any, quantity = 1){
    const existing = this.cart.find(c => c.product && c.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    this.persist();
    console.log(this.cart);
    return this.cart;
  }

  updateQuantity(productId: number, quantity: number){
    const idx = this.cart.findIndex(c => c.product && c.product.id === productId);
    if (idx === -1) return this.cart;
    if (quantity <= 0) {
      this.cart.splice(idx, 1);
    } else {
      this.cart[idx].quantity = quantity;
    }
    this.persist();
    return this.cart;
  }

  removeFromCart(productId: number){
    this.cart = this.cart.filter(c => !(c.product && c.product.id === productId));
    this.persist();
    return this.cart;
  }

  getTotal(){
    return this.cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  }

  private persist(){
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

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
}
