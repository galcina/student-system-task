export type StudentStatus = 'Active' | 'Inactive';

export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  courses: string[];
  status: StudentStatus;
}


