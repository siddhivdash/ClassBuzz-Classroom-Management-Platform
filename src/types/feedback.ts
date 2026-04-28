export type FeedbackCategory =
  | "Teaching Pace"
  | "Content Clarity"
  | "Engagement"
  | "Other";

export interface Feedback {
  _id: string;
  rating: number;
  category: FeedbackCategory;
  comment: string;
  submittedBy?: string;
  submittedByRole?: "student" | "teacher";
  classroomId?: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackSummary {
  total: number;
  averageRating: number;
  categoryCounts: { name: string; value: number }[];
  feedback: Feedback[];
}