import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  employees: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalEmployee = 0;
  employeesPerPage = 10;
  pancardPreview: null | undefined;
  aadharcardPreview: null | undefined;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  updateEmployeeImages(images: { pancard: string, aadharcard: string }, employee: any): void {
    // Update the employee data with the uploaded images
    employee.pancardImage = images.pancard;
    employee.aadharcardImage = images.aadharcard;
  }

  uploadFile(employee: any): void {
    this.router.navigate(['/image-upload-form']);
  }

  uploadImages(employee: any, images: { pancard: string, aadharcard: string }): void {
    this.userService.updateImages(employee._id, images).subscribe(
      () => {
        // Image update successful, update local data and reset previews
        employee.img.pancard = images.pancard;
        employee.img.aadharcard = images.aadharcard;

        // Reset previews
        this.pancardPreview = null;
        this.aadharcardPreview = null;
      },
      (error) => {
        console.error('Error updating images:', error);
      }
    );
  }

  fetchEmployees() {
    this.userService
      .getEmployees(this.currentPage, this.employeesPerPage)
      .subscribe(
        (data: any) => {
          this.employees = data.employees;
          this.currentPage = data.pagination.currentPage;
          this.totalPages = data.pagination.totalPages;
          this.totalEmployee = data.pagination.totalEmployees;
          this.employeesPerPage = data.pagination.employeesPerPage;
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchEmployees();
    }
  }

  // previewImage(event: any, employee: any): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];

  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       employee.previewUrl = reader.result as string;
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // }

  // showImagePreview(imageSrc: string, employee: any): void {
  //   // Display the image preview logic here
  //   // For example, you can use a modal or other UI element to show the preview
  //   console.log('Previewing image for employee:', employee);

  //   // For simplicity, log the image source
  //   console.log('Image Source:', imageSrc);
  // }
}
