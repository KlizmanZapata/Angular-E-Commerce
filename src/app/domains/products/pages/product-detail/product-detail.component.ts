import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export default class ProductDetailComponent {

  @Input() id?: string;
  product = signal<Product | null>(null);
  cover = signal('');
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  ngOnInit(){
    if(this.id){
      this.productService.getOne(this.id)
      .subscribe({
        next: (product) => {
          const processedImages = product.images.map(image => {
            let cleanedImage = image.replace(/^\["?|"?]$/g, '');
            try {
              cleanedImage = JSON.parse(cleanedImage)[0];
            } catch (error) {
              // Do nothing if parsing fails
            }
            return cleanedImage;
          });

          this.product.set({ ...product, images: processedImages });

          if (processedImages.length > 0) {
            this.cover.set(processedImages[0]);
          }
        }
      })
    }
  }

  changeCover(newImg: string){
    this.cover.set(newImg);
  }

  addToCart(){
    const product = this.product();
    if(product){
      this.cartService.addToCart(product);
    }
  }

}
