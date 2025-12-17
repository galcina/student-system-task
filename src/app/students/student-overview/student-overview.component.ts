import { Component, OnInit, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { ConfirmEventType, ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { StudentFormDialogComponent, StudentFormMode } from '../student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    MenuModule,
    ToastModule,
    ConfirmDialogModule,
    StudentFormDialogComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="app-shell">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <section class="student-card">
        <header class="student-card__header">
          <div>
            <div class="student-card__title">Student Overview</div>
            <div class="student-card__subtitle">Manage your students and their courses</div>
          </div>
          <button
            pButton
            label="Add Student"
            icon="pi pi-plus"
            (click)="openCreateDialog()"
          ></button>
        </header>

        <div class="student-card__body">
          <p-table
            [value]="students()"
            [paginator]="true"
            [rows]="rowsPerPage()"
            [rowsPerPageOptions]="[10, 20, 25, 50, 100]"
            [totalRecords]="students().length"
            [first]="first()"
            (onPage)="onPageChange($event)"
            [responsiveLayout]="'scroll'"
            [tableStyle]="{ 'min-width': '100%' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Student</th>
                <th>Courses</th>
                <th>Status</th>
                <th style="width: 4rem;"></th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-student>
              <tr>
                <td>
                  <div class="student-cell">
                    <div class="student-initials">
                      {{ getInitials(student) }}
                    </div>
                    <div class="student-meta">
                      <div class="student-name">
                        {{ student.firstName }} {{ student.lastName }}
                      </div>
                      <div class="student-id">
                        #{{ getRowNumber(student) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="course-pill" *ngFor="let course of student.courses">
                    {{ course }}
                  </span>
                </td>
                <td>
                  <p-tag
                    [value]="student.status"
                    [severity]="student.status === 'Active' ? 'success' : 'danger'"
                  ></p-tag>
                </td>
                <td style="text-align: center;">
                  <button
                    pButton
                    icon="pi pi-ellipsis-v"
                    class="p-button-text p-button-sm action-menu-trigger"
                    (click)="toggleMenu($event, student)"
                    aria-label="Actions"
                  ></button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="paginatorleft">
              <span class="pagination-info">
                Showing {{ getPaginationStart() }} to {{ getPaginationEnd() }} of {{ students().length }} entries
              </span>
            </ng-template>
          </p-table>
        </div>
      </section>

      <p-menu 
        #actionMenu
        [model]="menuItems()" 
        [popup]="true"
        [style]="{ width: '180px' }"
      ></p-menu>

      <app-student-form-dialog
        [visible]="dialogVisible()"
        [student]="selectedStudent()"
        [mode]="dialogMode()"
        (save)="onDialogSave($event)"
        (cancel)="closeDialog()"
      ></app-student-form-dialog>
    </div>
  `,
  styles: [
    `
      .student-meta {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .action-menu-trigger {
        color: #6b7280;
      }
    `
  ]
})
export class StudentOverviewComponent implements OnInit {
  students = signal<Student[]>([]);
  loading = signal(false);
  rowsPerPage = signal(20);
  first = signal(0);

  dialogVisible = signal(false);
  dialogMode = signal<StudentFormMode>('create');
  selectedStudent = signal<Student | null>(null);
  menuStudent = signal<Student | null>(null);
  menuItems = signal<MenuItem[]>([]);

  @ViewChild('actionMenu') actionMenu: any;

  constructor(
    private readonly studentService: StudentService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.studentService.getStudents().subscribe({
      next: (students) => {
        const sortedStudents = this.sortStudentsAlphabetically(students ?? []);
        this.students.set(sortedStudents);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load students'
        });
      }
    });
  }

  private sortStudentsAlphabetically(students: Student[]): Student[] {
    return [...students].sort((a, b) => {
      // Najprej primerjaj po priimku
      const lastNameA = (a.lastName || '').toLowerCase();
      const lastNameB = (b.lastName || '').toLowerCase();
      
      if (lastNameA !== lastNameB) {
        return lastNameA.localeCompare(lastNameB, 'sl');
      }
      
      // Če sta priimka enaka, primerjaj po imenu
      const firstNameA = (a.firstName || '').toLowerCase();
      const firstNameB = (b.firstName || '').toLowerCase();
      return firstNameA.localeCompare(firstNameB, 'sl');
    });
  }

  openCreateDialog(): void {
    this.dialogMode.set('create');
    this.selectedStudent.set(null);
    this.dialogVisible.set(true);
  }

  openEditDialog(student: Student): void {
    this.dialogMode.set('edit');
    this.selectedStudent.set(student);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedStudent.set(null);
  }

  onDialogSave(studentFromForm: Student): void {
    if (this.dialogMode() === 'create') {
      // Določi naslednji zaporedni ID (ignorira nenumerične ID-je, npr. 'eabd')
      const maxId = this.students().reduce((max, s) => {
        const rawId = s.id as unknown;
        const numericId =
          typeof rawId === 'string' ? parseInt(rawId, 10) : (rawId as number | undefined);
        if (!numericId || Number.isNaN(numericId)) {
          return max;
        }
        return Math.max(max, numericId);
      }, 0);

      const nextId = maxId + 1;
      const payload: Student = {
        ...studentFromForm,
        id: nextId
      };

      this.studentService.createStudent(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Student created successfully'
          });
          this.closeDialog();
          this.loadStudents();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create student'
          });
        }
      });
    } else {
      const current = this.selectedStudent();
      if (!current || !current.id) {
        return;
      }
// --- DOKONČNI POPRAVEK: Prisilna pretvorba ID-ja v NUMBER ---
const studentId: number = typeof current.id === 'string' 
? parseInt(current.id, 10) 
: (current.id as number);



      const updated: Student = {
        ...current,
        id: studentId,
        courses: studentFromForm.courses
      };

      this.studentService.updateStudent(updated).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Student courses updated'
          });
          this.closeDialog();
          this.loadStudents();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update student'
          });
        }
      });
    }
  }

  confirmDelete(student: Student): void {
    if (!student.id) {
      return;
    }

    this.confirmationService.confirm({
      message: `Delete ${student.firstName} ${student.lastName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.studentService.deleteStudent(student.id as number).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Student deleted'
            });
            this.loadStudents();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete student'
            });
          }
        });
      }
    });
  }

  getInitials(student: Student): string {
    const f = student.firstName?.charAt(0) ?? '';
    const l = student.lastName?.charAt(0) ?? '';
    return (f + l).toUpperCase();
  }

  toggleMenu(event: Event, student: Student): void {
    event.stopPropagation();
    this.menuStudent.set(student);
    this.menuItems.set([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.menuStudent()) {
            this.openEditDialog(this.menuStudent()!);
          }
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.menuStudent()) {
            this.confirmDelete(this.menuStudent()!);
          }
        }
      }
    ]);
    
    if (this.actionMenu) {
      this.actionMenu.toggle(event);
    }
  }

  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rowsPerPage.set(event.rows);
  }

  getPaginationStart(): number {
    return this.first() + 1;
  }

  getPaginationEnd(): number {
    const end = this.first() + this.rowsPerPage();
    return Math.min(end, this.students().length);
  }

  getRowNumber(student: Student): number {
    const index = this.students().findIndex(s => s.id === student.id);
    return index >= 0 ? index + 1 : 0;
  }
}


