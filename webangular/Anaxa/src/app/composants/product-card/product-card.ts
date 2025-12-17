import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCard {
  @Input() product: any; 
  @Output() onClick = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {


  }
  
  onProductClick(event: any){
    console.log(event);
    this.onClick.emit({event: event, product: this.product});
  }
  
}
