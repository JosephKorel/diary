export interface User {
  name: string;
  email?: string;
  avatar?: string;
}

export interface MyTasks {
  _id: string;
  author: string;
  email: string;
  task: string;
  done: boolean;
  date: string;
}

export interface MyNotes {
  _id: string;
  author: string;
  email: string;
  note: string;
  media: { name: string; url: string }[];
  date: string;
}

export interface FileInt {
  name: string;
  url: string;
  type: string;
}
