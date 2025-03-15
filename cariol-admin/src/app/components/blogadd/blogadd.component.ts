import { Component } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-add',
  standalone: false,
  templateUrl: './blogadd.component.html',
  styleUrls: ['./blogadd.component.css']
})
export class BlogAddComponent {
  newBlog = { title: '', author: '', content: '', images: '' };

  constructor(private blogService: BlogService, private router: Router) {}
  // Cấu hình cho quill-editor
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
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newBlog.images = reader.result as string; // Lưu ảnh dưới dạng base64
      };
      reader.readAsDataURL(file);
    }
  }

  
    onSubmit() {
      this.blogService.addBlog(this.newBlog).subscribe({
        next: (response) => {
          console.log('Blog saved successfully:', response);
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
        complete: () => {
          console.log('Request complete');
        }
      });
      
    }

    cancelPost() {
      // Điều hướng về trang danh sách blog hoặc trang chính
      this.router.navigate(['/blog']);
    }
  }