import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blogedit',
  standalone: false,
  templateUrl: './blogedit.component.html',
  styleUrls: ['./blogedit.component.css']
})
export class BlogEditComponent implements OnInit {
  blogId: string | null = '';
  newBlog = {
    title: '',
    author: '',
    content: '',
    image: '',
    images: [] as string[] // Mảng chứa các ảnh của blog
  };
  successMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // Các nút định dạng
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // Tiêu đề
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // Danh sách
      [{ 'script': 'sub'}, { 'script': 'super' }],      // Chỉ số trên/dưới
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // Thụt lề
      [{ 'size': ['small', false, 'large', 'huge'] }],  // Cỡ chữ
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                                         // Xóa định dạng
    ]
  };

  ngOnInit(): void {
    // Lấy id từ URL (ví dụ: /edit-blog/:id)
    this.blogId = this.activatedRoute.snapshot.paramMap.get('id');
    
    // Nếu có id, gọi API để lấy blog
    if (this.blogId) {
      this.blogService.getBlogById(this.blogId).subscribe(
        (response) => {
          this.newBlog = response; // Truyền dữ liệu blog vào form
        },
        (error) => {
          console.error('Error fetching blog:', error);
        }
      );
    }
  }

onSubmit() {
  if (this.blogId) {
    // Điều hướng ra ngoài trước
    this.router.navigate(['/blogs']);

    // Xóa blog cũ
    this.blogService.deleteBlog(this.blogId).subscribe(
      (response) => {
        console.log('Blog deleted:', response);

        // Sau khi xóa thành công, thêm blog mới
        this.blogService.addBlog(this.newBlog).subscribe(
          (newBlogResponse) => {
            console.log('New blog added:', newBlogResponse);
            
            // Hiển thị thông báo thành công
            this.successMessage = 'Cập nhật blog thành công!';

            // Điều hướng về trang blog list sau khi thêm blog mới
            setTimeout(() => {
              this.router.navigate(['/blog']);
            }, 2000); // Điều hướng lại sau 2 giây để người dùng thấy thông báo
          },
          (error) => {
            console.error('Error adding new blog:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting blog:', error);
      }
    );
  }
}

  
    // Phương thức xóa ảnh
    deleteImage(image: string): void {
      this.newBlog.images = this.newBlog.images.filter(img => img !== image); // Xóa ảnh khỏi mảng
    }
    onFileChange(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newBlog.image = reader.result as string; // Lưu ảnh dưới dạng base64
        };
        reader.readAsDataURL(file);
      }
    }

    cancelEdit() {
      // Điều hướng về trang danh sách blog hoặc trang chính
      this.router.navigate(['/blog']);
    }
}
