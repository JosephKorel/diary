export interface User {
  name: string;
  email?: string;
  avatar?: string;
  dayEvaluation: { date: string; value: number }[];
}

export interface MyTasks {
  _id: string;
  author: string;
  email: string;
  task: string;
  degree: number;
  done: boolean;
  date: string;
}

export interface MyNotes {
  _id: string;
  author: string;
  email: string;
  title: string;
  note: string;
  media: { name: string; url: string }[];
  date: string;
}

export interface MyComments {
  _id: string;
  author: string;
  email: string;
  comment: string;
  mood: number;
  time: string;
  date: string;
}

export interface MyReminder {
  _id: string;
  author: string;
  email: string;
  title: string;
  content: string;
  addedOn: string;
  when: string;
  time: string;
  degree: number;
}

export interface FileInt {
  name: string;
  url: string;
}

export interface DateInt {
  when: string;
  date: string;
}

export interface Evaluation {
  value: number;
  date: string;
}
