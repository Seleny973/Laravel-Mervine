import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { UserService } from '../../services/user-service';
import { CategoryService } from '../../services/category-service';
import { OrderService } from '../../services/order-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin {
  products: any[] = [];
  users: any[] = [];
  categories: any[] = [];
  orders: any[] = [];

  userForm: FormGroup;
  productForm: FormGroup;
  categoryForm: FormGroup;
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private router: Router
  ){
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: [''],
      role: ['user']
    });

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, Validators.required],
      category_id: ['', Validators.required],
      description: [''],
      image: [''],
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.orderForm = this.fb.group({
      user_id: ['', Validators.required],
      product_id: ['', Validators.required],
      quantity: [1, Validators.required],
      price: [0, Validators.required],
      status: ['pending']
    });
  }

  ngOnInit(){
    this.refreshAll();
  }

  refreshAll(){
    this.productService.getProducts().subscribe({
      next: (p: any) => { this.products = p; },
      error: (e:any) => console.error(e)
    });

    this.userService.getAll().subscribe({
      next: (u: any) => { this.users = u; },
      error: (e:any) => console.error(e)
    });

    this.categoryService.list().subscribe({
      next: (c:any) => { this.categories = c; },
      error: (e:any) => console.error(e)
    });

    this.orderService.list().subscribe({
      next: (o:any) => { this.orders = o; },
      error: (e:any) => console.error(e)
    });
  }

  // Users
  addUser(isAdmin = false){
    if (this.userForm.invalid) return;
    const payload = { ...this.userForm.value, role: isAdmin ? 'admin' : (this.userForm.value.role || 'user') };
    const action = isAdmin ? this.userService.createAdmin(payload) : this.userService.createUser(payload);
    action.subscribe({
      next: () => { this.userForm.reset({ role: 'user' }); this.refreshAll(); },
      error: (e:any) => console.error(e)
    });
  }

  updateUser(user:any){
    const payload = { username: user.username, email: user.email, name: user.name, role: user.role };
    this.userService.updateUser(user.id, payload).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  deleteUser(user:any){
    if (!confirm(`Supprimer l'utilisateur ${user.username} ?`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  delete(product: any){
    if (!product || !product.id) return;
    if (!confirm('Supprimer le produit "' + product.title + '" ?')) return;
    this.productService.deleteProductRemote(product.id).subscribe({
      next: (res:any) => {
        // remove locally from view
        this.products = this.products.filter(x => x.id !== product.id);
        // also remove from cart if present
        this.productService.removeFromCart(product.id);
      },
      error: (err:any) => {
        console.error('Erreur suppression', err);
        alert('Impossible de supprimer le produit sur le remote');
      }
    });
  }

  // Products
  createProduct(){
    if (this.productForm.invalid) return;
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => { this.productForm.reset(); this.refreshAll(); },
      error: (e:any) => console.error(e)
    });
  }

  updateProductPrompt(p:any){
    const title = prompt('Titre', p.title);
    const price = Number(prompt('Prix', p.price));
    const category_id = Number(prompt('Catégorie ID', p.category_id || ''));
    if (!title || !category_id) return;
    this.productService.updateProduct(p.id, { title, price, category_id }).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  // Categories
  createCategory(){
    if (this.categoryForm.invalid) return;
    this.categoryService.create(this.categoryForm.value).subscribe({
      next: () => { this.categoryForm.reset(); this.refreshAll(); },
      error: (e:any) => console.error(e)
    });
  }

  updateCategoryPrompt(c:any){
    const name = prompt('Nom', c.name);
    if (!name) return;
    this.categoryService.update(c.id, { name }).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  deleteCategory(c:any){
    if (!confirm(`Supprimer la catégorie ${c.name} ?`)) return;
    this.categoryService.delete(c.id).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  // Orders (simplifié : un seul item)
  createOrder(){
    if (this.orderForm.invalid) return;
    const { user_id, product_id, quantity, price, status } = this.orderForm.value;
    const payload = {
      user_id,
      status,
      items: [{ product_id, quantity, price }]
    };
    this.orderService.create(payload).subscribe({
      next: () => { this.orderForm.reset({ quantity:1, price:0, status:'pending' }); this.refreshAll(); },
      error: (e:any) => console.error(e)
    });
  }

  updateOrderStatus(o:any){
    const status = prompt('Nouveau statut', o.status || 'pending');
    if (!status) return;
    this.orderService.update(o.id, { status }).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }

  deleteOrder(o:any){
    if (!confirm(`Supprimer la commande #${o.id} ?`)) return;
    this.orderService.delete(o.id).subscribe({
      next: () => this.refreshAll(),
      error: (e:any) => console.error(e)
    });
  }
}
