// src/app/models/review.model.ts
export interface Review {
    id: number;
    userId: number;
    userName: string; 
    comment: string;
    rating: number;
    createdAt: string;
  }
  