import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VoucherService } from '../../services/voucher.service';

@Component({
  standalone: true,
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class VoucherComponent implements OnInit {
  isAddModalOpen = false;
  isEditModalOpen = false;
  selectedVoucherIndex: number | null = null;

  newVoucher = {
    code: '',
    startDate: '',
    endDate: '',
    discount: 0,
    minOrderValue: 0
  };

  vouchers: any[] = [];
  filteredVouchers: any[] = [];
  editedVoucher: any = {};

  constructor(private voucherService: VoucherService) {}

  ngOnInit() {
    this.loadVouchers();
  }

  // ✅ Lấy danh sách voucher từ API
  loadVouchers() {
    this.voucherService.getVouchers().subscribe(
      (data) => {
        this.vouchers = data;
        this.filterVouchers();
      },
      (error) => console.error('Lỗi khi tải danh sách voucher:', error)
    );
  }

  getVoucherStatus(startDate: string, endDate: string): string {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'expired';
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.resetForm();
  }

  // ✅ Thêm voucher mới vào API
  addVoucher() {
    if (this.validateVoucher(this.newVoucher)) {
      this.voucherService.addVoucher(this.newVoucher).subscribe(
        (response) => {
          this.vouchers.push(response);
          this.filterVouchers();
          this.closeAddModal();
        },
        (error) => console.error('Lỗi khi thêm voucher:', error)
      );
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  editVoucher(i: number) {
    this.selectedVoucherIndex = i;
    this.editedVoucher = { ...this.filteredVouchers[i] }; // Sao chép để tránh thay đổi trực tiếp
    this.isEditModalOpen = true;
  }   

  // ✅ Cập nhật voucher
  updateVoucher() {
    if (!this.editedVoucher._id) {
      console.error("Không tìm thấy ID của voucher để cập nhật!");
      return;
    }
  
    this.voucherService.updateVoucher(this.editedVoucher).subscribe(
      (response) => {
        console.log("Cập nhật thành công:", response);
  
        // Cập nhật danh sách
        const index = this.vouchers.findIndex(v => v._id === this.editedVoucher._id);
        if (index !== -1) {
          this.vouchers[index] = response.updatedVoucher;
        }
  
        this.filterVouchers(); // Lọc lại danh sách
        this.isEditModalOpen = false; // Đóng modal
      },
      (error) => {
        console.error("Lỗi khi cập nhật voucher:", error);
      }
    );
  }

  // ✅ Xóa voucher
  deleteVoucher(index: number) {
    const voucherToDelete = this.vouchers[index];
  
    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      this.voucherService.deleteVoucher(voucherToDelete._id).subscribe({
        next: () => {
          this.vouchers.splice(index, 1); // Xóa trên UI
          this.filterVouchers();
        },
        error: (err) => {
          console.error('Lỗi khi xóa voucher:', err);
          alert('Xóa thất bại! Vui lòng thử lại.');
        }
      });
    }
  }  



  validateVoucher(voucher: any): boolean {
    return voucher.code.trim() !== '' &&
           voucher.startDate !== '' &&
           voucher.endDate !== '' &&
           voucher.discount !== null &&
           voucher.minOrderValue !== null;
  }

  resetForm() {
    this.newVoucher = { code: '', startDate: '', endDate: '', discount: 0, minOrderValue: 0 };
    this.selectedVoucherIndex = null;
  }

  filterVouchers(event?: Event) {
    const status = event ? (event.target as HTMLSelectElement).value : 'all';

    this.filteredVouchers = this.vouchers.filter(voucher => {
      const voucherStatus = this.getVoucherStatus(voucher.startDate, voucher.endDate);
      return status === 'all' || voucherStatus === status;
    });
  }
}
