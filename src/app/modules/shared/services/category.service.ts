import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   * Get all categories
   * @returns an object with categories and metadata
   */
  getCategories(){
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }


  /**
   * Save a category
   * @param body category to save
   * @returns category saved
   */
  saveCategory(body:any) {
    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, body);
  }

  /**
   * Update a category
   * @param body data of category to update
   * @param id of the category to update
   * @returns category updated
   */
  updateCategory(body : any, id : any) {
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.put(endpoint, body);
  }
}
