import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Sửa lại đường dẫn nếu cần
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  newProduct = {
    name: '',
    price: 0,
    description: '',
    categoryName: '',
    color: '',
    infor: '',
    amount: 0,
    image: null as any
  };

  selectedFile: File | null = null;  // Khai báo file ảnh

  categories: string[] = []; 

  constructor(private productService: ProductService, private router: Router) {}  // Khai báo productService và router

  ngOnInit(): void {
    this.loadCategories(); // ✅ Gọi hàm tải danh mục khi component khởi chạy
  }

  // Xử lý khi người dùng chọn ảnh
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];  // Lưu file đã chọn
    if (this.selectedFile) {
      this.convertToBase64(this.selectedFile);
    }
  }

  // Chuyển đổi ảnh thành base64
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.newProduct.image = reader.result as string; // Lưu ảnh base64 vào product
    };
    reader.readAsDataURL(file);
  }

  // Hàm gửi sản phẩm lên server
  postProduct() {
    this.productService.addProduct(this.newProduct).subscribe(
      (data) => {
        console.log('Sản phẩm đã được thêm thành công:', data);
        window.alert('Thêm sản phẩm thành công!');
        this.router.navigate(['/product-management']);  // Chuyển hướng về trang quản lý sản phẩm
      },
      (error) => {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    );
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Lỗi khi tải danh mục sản phẩm:', error);
      }
    );
  }

  cancelAdd(): void {
    this.router.navigate(['/product-management']);
  }
}
