import { Student } from '../types';

const STORAGE_KEY = 'studentGradeManagementSystem';

export const getStudents = (): Student[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const addStudent = (student: Student): void => {
  const students = getStudents();
  saveStudents([...students, student]);
};

export const updateStudent = (updatedStudent: Student): void => {
  const students = getStudents();
  const updatedStudents = students.map((student) => 
    student.id === updatedStudent.id ? updatedStudent : student
  );
  saveStudents(updatedStudents);
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filteredStudents = students.filter((student) => student.id !== id);
  saveStudents(filteredStudents);
};