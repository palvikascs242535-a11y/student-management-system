import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentService } from '../services/student';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export class StudentComponent implements OnInit {

  adminName = 'Admin';

  role = '';
  isBoss = false;
  canEdit = false;

  students: any[] = [];
  pendingUsers: any[] = [];

  searchText = '';
  totalStudents = 0;

  student = {
    rollNo: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    year: ''
  };

  isEdit = false;
  editId: string | null = null;

  constructor(
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const logged = localStorage.getItem('loggedIn');
    if (!logged) {
      window.location.href = '/';
      return;
    }

    this.adminName = localStorage.getItem('adminName') || 'Admin';

    // ⭐ role check
    this.role = localStorage.getItem('role') || '';
    this.isBoss = this.role === 'boss';
    this.canEdit = this.role === 'boss' || this.role === 'admin';

    this.loadStudents();

    // ⭐ IMPORTANT: boss ko pending approvals dikhane ke liye
    if (this.isBoss) {
      this.loadPendingUsers();
    }
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(data => {
      this.students = data;
      this.totalStudents = data.length;
    });
  }

  // ⭐ LOAD PENDING USERS
  loadPendingUsers() {
    this.http.get<any[]>('http://localhost:5000/api/auth/pending')
      .subscribe(data => {
        this.pendingUsers = data;
      });
  }

  approveUser(id: string) {
    this.http.put(`http://localhost:5000/api/auth/approve/${id}`, {})
      .subscribe(() => this.loadPendingUsers());
  }

  rejectUser(id: string) {
    this.http.delete(`http://localhost:5000/api/auth/reject/${id}`)
      .subscribe(() => this.loadPendingUsers());
  }

  filteredStudents() {
    if (!this.searchText) return this.students;

    return this.students.filter(s =>
      s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.rollNo.toString().includes(this.searchText)
    );
  }

  submitStudent() {
    if (!this.canEdit) return;

    if (this.isEdit && this.editId) {
      this.studentService.updateStudent(this.editId, this.student)
        .subscribe(() => {
          this.resetForm();
          this.loadStudents();
        });
    } else {
      this.studentService.addStudent(this.student)
        .subscribe(() => {
          this.resetForm();
          this.loadStudents();
        });
    }
  }

  editStudent(s: any) {
    if (!this.canEdit) return;

    this.isEdit = true;
    this.editId = s._id;
    this.student = { ...s };
  }

  deleteStudent(id: string) {
    if (!this.canEdit) return;

    if (confirm('Delete this student?')) {
      this.studentService.deleteStudent(id)
        .subscribe(() => this.loadStudents());
    }
  }

  resetForm() {
    this.student = {
      rollNo: '',
      name: '',
      email: '',
      phone: '',
      course: '',
      year: ''
    };
    this.isEdit = false;
    this.editId = null;
  }

  logout() {
    if (confirm("Logout?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  }
}