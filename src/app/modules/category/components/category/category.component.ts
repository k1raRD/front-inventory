import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  constructor(private categoryService: CategoryService){}

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories() {
    this.categoryService.getCategories().subscribe( (data:any) => {

      console.log("Respuesta categories: ", data);
      this.processCategoriesResponse(data);
            
    }, (error) => {
      console.log("Errores: ", error);
      
    })
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00") {
      let listCategory = resp.categoryResponse.categories;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}