import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/products';
  private searchApiUrl = 'http://localhost:3002/products/search';
  private adminApiUrl = 'http://localhost:3002/admin/products';
  
  constructor(private http: HttpClient) {}


getAdminProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // Gọi API lấy tất cả sản phẩm
  }

  // searchProducts(searchQuery: string, categoryFilter: string): Observable<any[]> {
  //   let url = `${this.searchApiUrl}?name=${searchQuery}&categoryName=${categoryFilter}`;
  //   return this.http.get<any[]>(url);
  // }

  searchProducts(searchQuery: string, categoryFilter: string): Observable<any[]> {
    let url = `${this.searchApiUrl}?`;
  
    if (searchQuery) {
      url += `name=${encodeURIComponent(searchQuery)}&`;
    }
  
    if (categoryFilter) {
      url += `categoryName=${encodeURIComponent(categoryFilter)}`;
    }
  
    console.log("Gửi request API:", url); // Debug log kiểm tra URL gửi đi
  
    return this.http.get<any[]>(url);
  }
  

  // Lấy danh sách các danh mục
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3002/api/categories');
  }

  // Thêm mới sản phẩm
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  // Xóa sản phẩm
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật sản phẩm
  // updateProduct(id: string, product: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  // }

// 📌 API lấy thông tin sản phẩm theo ID (Admin)
getProductById(productId: string): Observable<any> {
  return this.http.get<any>(`${this.adminApiUrl}/${productId}`);
}

  
  updateProduct(productId: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, productData);
  }
  

}
