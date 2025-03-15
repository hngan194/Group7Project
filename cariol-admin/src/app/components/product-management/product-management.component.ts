// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-product-management',
//   standalone: false,
//   templateUrl: './product-management.component.html',
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products: any[] = [];
//   categories: string[]  = [];
//   searchQuery: string = '';
//   categoryFilter: string = 'all';

//   constructor(private productService: ProductService, private router: Router) {}

//   ngOnInit(): void {
//     this.loadProducts();
//     this.loadCategories();
//   }

 
// loadProducts(): void {
//   this.productService.getAdminProducts().subscribe(
//     (products) => {
//       console.log("Sản phẩm nhận được từ API:", products);  // Debug log
//       this.products = products;  // Gán dữ liệu sản phẩm vào biến
//     },
//     (error) => {
//       console.error("Lỗi khi gọi API:", error);  // Debug lỗi
//     }
//   );
// }

//   // Tải danh mục sản phẩm từ server
//   loadCategories() {
//     this.productService.getCategories().subscribe(categories => {
//       this.categories = categories;
//     });
//   }

//   // Hàm tìm kiếm
//   onSearch() {
//     this.loadProducts();
//   }

//   onCategoryChange() {
//     this.loadProducts();  // Gọi lại hàm loadProducts khi categoryFilter được thay đổi
//   }

//   // Hàm thêm sản phẩm
//   addProduct() {
//     this.router.navigate(['/add-product']);
//   }

//   // Hàm sửa sản phẩm
//   editProduct(product: any) {
//     this.router.navigate([`/edit-product/${product._id}`]);
//   }

//   // Hàm xóa sản phẩm
//   deleteProduct(id: string) {
//     if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
//       this.productService.deleteProduct(id).subscribe(() => {
//         this.loadProducts();
//       });
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = []; // Danh sách sản phẩm
  categories: string[] = []; // Danh sách danh mục
  searchQuery: string = ''; // Chuỗi tìm kiếm
  categoryFilter: string = 'all'; // Mặc định hiển thị tất cả sản phẩm

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();  // Tải danh mục trước
    this.loadProducts();    // Sau đó tải toàn bộ sản phẩm
  }

  // 📌 Tải danh sách sản phẩm từ API
  loadProducts(): void {
    this.productService.searchProducts(this.searchQuery, this.categoryFilter).subscribe(
      (products) => {
        console.log("Sản phẩm nhận được từ API:", products);  // Debug log
        this.products = products;  // Gán dữ liệu sản phẩm vào biến
      },
      (error) => {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    );
  }

  // 📌 Tải danh mục sản phẩm từ server
  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (categories) => {
        // this.categories = ['Tất cả sản phẩm', ...categories]; // Thêm "Tất cả" vào danh sách

        this.categories = categories; // Thêm "Tất cả" vào danh sách
      },
      (error) => {
        console.error("Lỗi khi tải danh mục:", error);
      }
    );
  }

  // 📌 Xử lý khi chọn danh mục (lọc sản phẩm)
  onCategoryChange(): void {
    console.log("Danh mục đã chọn:", this.categoryFilter); // Debug log
    this.loadProducts(); // Gọi lại API để lọc danh sách sản phẩm
  }

  // 📌 Tìm kiếm sản phẩm theo tên
  onSearch(): void {
    this.loadProducts(); // Gọi lại API với tên sản phẩm tìm kiếm
  }

  // 📌 Điều hướng đến trang thêm sản phẩm
  addProduct(): void {
    this.router.navigate(['/add-product']);
  }

  // 📌 Điều hướng đến trang chỉnh sửa sản phẩm
  editProduct(product: any): void {
    this.router.navigate([`/edit-product/${product._id}`]);
  }

  // 📌 Xóa sản phẩm
  deleteProduct(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts(); // Cập nhật danh sách sau khi xóa
      });
    }
  }
}
