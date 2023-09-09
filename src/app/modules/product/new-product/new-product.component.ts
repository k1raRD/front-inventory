import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Category {
  description: string,
  id: number,
  name: string
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent {
  public productForm: FormGroup;
  estadoForm: string = "";
  categories: Category[] = [];
  selectedFile: any;
  nameImage: string = "";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.estadoForm = "Agregar"
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onSave() {
    let data = {
      name: this.productForm.get('name')?.value, 
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryId', data.category);

    // Call the service to save a product
    this.productService.saveProduct(uploadImageData)
      .subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error) => {
        this.dialogRef.close(2);
      })
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe((data: any) => {
        this.categories = data.categoryResponse.categories;
      }, (error : any) => {
        console.log("Error al consultar categories.");
      })  
  }

  onFileChanged(event : any) {
    this.selectedFile = event.target.files[0];

    this.nameImage = event.target.files[0].name;
  }
}
