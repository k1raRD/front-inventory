import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {

  isAdmin: any;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'quantity',
    'category',
    'picture',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code == '00') {
      let listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dateProduct.push(element);
      });

      // seteamos el datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto agregado', 'Exitoso!');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al guardar producto', 'Error');
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  edit(id:number, name:string, price:number, quantity:number, category:any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '500px',
      data: {id: id, name: name, price: price, quantity : quantity, category : category}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto editado', 'Exitoso!');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al editar producto', 'Error');
      }
    });
  }

  delete(id : any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id, module: "product"}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto eliminado', 'Exitoso!');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al eliminar producto', 'Error');
      }
    }); 
  }

  buscar(nombre : any) {
    if(nombre.length === 0) {
        return this.getProducts();
    }

    this.productService.getProductsByName(nombre)
      .subscribe((response) => {
        this.processProductResponse(response);
      });
  }

  exportExcel() {
    this.productService.exportProductsToExcel()
        .subscribe((data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "products.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar('Archivo exportado correctamente', 'Exitoso!');
        }, (error: any) => {
          this.openSnackBar('No se puedo exportar el archivo', 'Error');
        })
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
