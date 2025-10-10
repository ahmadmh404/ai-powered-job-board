import { ReactNode } from "react";

export type ChildrenProps = {
  children: ReactNode;
};

export type User = {
  id: string;
  name: string;
  imageUrl: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Organization = {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
