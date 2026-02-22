// app/types/types.ts
export interface Subject {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  hoursNeeded: number;
  deadline: string;
  files?: string[];
}
