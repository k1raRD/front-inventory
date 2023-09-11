import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  chartBar: any;
  chartDoughnut: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log('Respuesta de productos: ' + data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log('Error del producto');
      }
    );
  }

  processProductResponse(resp: any) {
    const nameProduct: String[] = [];
    const quantity: number[] = [];

    if (resp.metadata[0].code == '00') {
      let listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        quantity.push(element.quantity);
      });

      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            {label: 'Productos', data: quantity}
          ]
        }
      });

      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [
            {label: 'Productos', data: quantity}
          ]
        }
      });
    }
  }
}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  picture: any;
}
