// src/app/students/student-form-dialog/student-form-dialog.component.ts

import { Component, EventEmitter, Input, Output, computed, signal, effect, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms'; 

// --- KONČNI IN ZANESLJIV UVOZ MODULOV ---
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips'; 
import { DropdownModule } from 'primeng/dropdown'; 
// ----------------------------------------

import { Student, StudentStatus } from '../../models/student.model';

export type StudentFormMode = 'create' | 'edit';

@Component({
  selector: 'app-student-form-dialog',
  standalone: true,
  // KONČNI SEZNAM IMPORTS Z MODULI
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    DialogModule, 
    InputTextModule, 
    ButtonModule, 
    ChipsModule, // Modul
    DropdownModule // Modul
  ],
  template: `
    <p-dialog
      [(visible)]="visibleInternal"
      [modal]="true"
      [style]="{ width: '480px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onHide()"
      [header]="dialogTitle()"
    >
      <form (ngSubmit)="onSubmit()" class="student-form">
        <div class="field">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            pInputText
            name="firstName"
            [(ngModel)]="workingCopy.firstName"
            [readonly]="mode === 'edit'"
            required
          />
        </div>

        <div class="field">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            pInputText
            name="lastName"
            [(ngModel)]="workingCopy.lastName"
            [readonly]="mode === 'edit'"
            required
          />
        </div>

        <div class="field">
          <label for="status">Status</label>
          <p-dropdown
            inputId="status"
            [options]="statusOptions"
            optionLabel="label"
            optionValue="value"
            name="status"
            [(ngModel)]="workingCopy.status"
            [disabled]="mode === 'edit'"
          ></p-dropdown>
        </div>

        <div class="field">
          <label for="courses">Courses</label>
          <p-chips
            inputId="courses"
            [(ngModel)]="workingCopy.courses"
            name="courses"
            separator=","
            [addOnBlur]="true"
            [max]="10"
            placeholder="Type course and press Enter"
          ></p-chips>
          <small class="hint">Only courses can be edited in edit mode.</small>
        </div>

        <div class="form-actions">
          <button
            type="button"
            pButton
            label="Cancel"
            class="p-button-secondary"
            (click)="cancel.emit()"
          ></button>
          <button
            type="submit"
            pButton
            label="Save"
            [disabled]="!isValid()"
          ></button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [
    `
      .student-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 0.5rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .field label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #9ca3af;
      }

      .hint {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .form-actions {
        margin-top: 0.75rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `
  ]
})
export class StudentFormDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() student: Student | null = null;
  @Input() mode: StudentFormMode = 'create';
  @Output() save = new EventEmitter<Student>();
  @Output() cancel = new EventEmitter<void>();

  protected visibleInternal = signal(false);

  protected statusOptions: { label: string; value: StudentStatus }[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  workingCopy: Student = {
    firstName: '',
    lastName: '',
    courses: [],
    status: 'Active'
  };

  dialogTitle = computed(() =>
    this.mode === 'create' ? 'Add Student' : 'Edit Student'
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
        this.visibleInternal.set(this.visible);
    }
    
    if (this.student) {
      this.workingCopy = {
        ...this.student,
        courses: [...(this.student.courses ?? [])]
      };
    } else {
      this.workingCopy = {
        firstName: '',
        lastName: '',
        courses: [],
        status: 'Active'
      };
    }
  }

  onHide(): void {
    if (this.visible) {
      this.cancel.emit();
    }
  }

  isValid(): boolean {
    return Boolean(this.workingCopy.firstName && this.workingCopy.lastName && this.workingCopy.status);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      return;
    }
    this.save.emit({ ...this.workingCopy });
  }
}

