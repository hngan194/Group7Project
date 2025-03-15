// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductService } from '../../services/product.service';

// @Component({
//   selector: 'app-edit-product',
//   standalone: false,
//   templateUrl: './edit-product.component.html',
//   styleUrls: ['./edit-product.component.css']
// })
// export class EditProductComponent implements OnInit {
//   product: any = {}; // Dữ liệu sản phẩm cần chỉnh sửa
//   categories: string[] = []; // Danh sách danh mục sản phẩm

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private productService: ProductService
//   ) {}

//   ngOnInit(): void {
//     this.loadCategories(); // Tải danh mục sản phẩm từ server
//     const productId = this.route.snapshot.paramMap.get('id');
//     if (productId) {
//       this.getProductDetails(productId);
//     }
//   }

//   // 📌 Tải danh mục sản phẩm từ server
//   loadCategories() {
//     this.productService.getCategories().subscribe(
//       (data) => {
//         this.categories = data;
//       },
//       (error) => {
//         console.error('Lỗi khi lấy danh mục:', error);
//       }
//     );
//   }

//   // 📌 Lấy thông tin sản phẩm theo ID từ server
//   getProductDetails(productId: string) {
//     this.productService.getProductById(productId).subscribe(
//       (data) => {
//         this.product = data;
//       },
//       (error) => {
//         console.error('Lỗi lấy dữ liệu sản phẩm:', error);
//         alert('Không thể lấy thông tin sản phẩm!');
//       }
//     );
//   }

//   // 📌 Cập nhật sản phẩm
//   updateProduct() {
//     if (!this.product.name || !this.product.price || !this.product.amount || !this.product.categoryName) {
//       alert('Vui lòng nhập đầy đủ thông tin!');
//       return;
//     }

//     this.productService.updateProduct(this.product._id, this.product).subscribe(
//       () => {
//         alert('Cập nhật sản phẩm thành công!');
//         this.router.navigate(['/admin/product-management']);
//       },
//       (error) => {
//         console.error('Lỗi khi cập nhật sản phẩm:', error);
//         alert('Cập nhật thất bại, vui lòng thử lại!');
//       }
//     );
//   }

//   // 📌 Hủy chỉnh sửa và quay lại danh sách sản phẩm
//   cancelEdit() {
//     this.router.navigate(['/admin/product-management']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {}; // Lưu trữ dữ liệu sản phẩm cần chỉnh sửa
  categories: string[] = []; // Danh mục sản phẩm

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Tải danh mục từ server
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProductDetails(productId);
    }
  }

  // 📌 Tải danh mục sản phẩm từ server
  loadCategories() {
    this.productService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    );
  }

  // 📌 Lấy thông tin sản phẩm theo ID từ server
  getProductDetails(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Lỗi lấy dữ liệu sản phẩm:', error);
        alert('Không thể lấy thông tin sản phẩm!');
      }
    );
  }

  // 📌 Xử lý khi người dùng chọn ảnh
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  // 📌 Chuyển đổi ảnh thành base64
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.product.image = reader.result as string; // Lưu ảnh base64 vào product
    };
    reader.readAsDataURL(file);
  }

  // 📌 Cập nhật sản phẩm
  updateProduct() {
    if (!this.product.name || !this.product.price || !this.product.amount || !this.product.categoryName) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    this.productService.updateProduct(this.product._id, this.product).subscribe(
      () => {
        alert('Cập nhật sản phẩm thành công!');
        this.router.navigate(['product-management']);
      },
      (error) => {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        alert('Cập nhật thất bại, vui lòng thử lại!');
      }
    );
  }

  // 📌 Hủy chỉnh sửa
  cancelEdit() {
    this.router.navigate(['product-management']);
  }
}

