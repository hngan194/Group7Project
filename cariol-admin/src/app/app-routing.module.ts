import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';  // Import BlogComponent
import { LoginComponent } from './components/login/login.component';
import { BlogAddComponent } from './components/blogadd/blogadd.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { BlogEditComponent } from './components/blogedit/blogedit.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

import { VoucherComponent } from './components/voucher/voucher.component';

import { AuthGuard } from './services/auth.guard'; // Uncomment if you use AuthGuard

const routes: Routes = [
  { path: 'role-management', component: RoleManagementComponent, canActivate: [AuthGuard] },  // Chỉ Admin có quyền
  { path: 'login', component: LoginComponent },  // Trang đăng nhập
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },  // Route cho BlogComponent
  { path: 'blog-add', component: BlogAddComponent },  // Route cho BlogAddComponent
  { path: 'blog-edit/:id', component: BlogEditComponent },  // Route cho BlogEditComponent với id
  { path: 'dashboard', component: DashboardComponent },  // Route cho DashboardComponent
  { path: 'product-management', component: ProductManagementComponent , canActivate: [AuthGuard] },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component:EditProductComponent},
  {path: 'voucher-management', component: VoucherComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Đảm bảo bạn sử dụng forRoot để cấu hình routing
  exports: [RouterModule]
})
export class AppRoutingModule { }
