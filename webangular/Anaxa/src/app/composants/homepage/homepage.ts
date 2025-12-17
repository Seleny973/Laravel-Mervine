import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { UserService } from '../../services/user-service';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage {

  constructor(
    private userService: UserService,
    private productService: ProductService,
  ) {}
  products:any = [];
  cart:any = [];
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (apiResponse) => {
        console.log('Produits récupérés :', apiResponse);
        this.products = apiResponse;
      },
      error: (error) => {
        
        console.error('Erreur lors de la récupération des produits', error);
      }
    });

    this.cart = this.productService.cart
    console.log("cart =",this.cart);


  }

  handleProductClick(callback: any) {
    let product = callback.event;
    console.log(product);
    this.cart = this.productService.addToCart(callback.product);
    console.log("cart =",this.cart);
  }
}
