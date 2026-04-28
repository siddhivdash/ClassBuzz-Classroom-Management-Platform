export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'teacher' | 'student' | 'admin';
  email: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  isPinned: boolean;
  priority: 'low' | 'medium' | 'high';
  targetClasses: string[];
  reactions: { emoji: string; count: number }[];
  commentsCount: number;
  isRead?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  author: User;
  createdAt: string;
  expiresAt: string;
  isMultiChoice: boolean;
  totalVotes: number;
  targetClasses: string[];
  status: 'active' | 'closed';
}

export interface Doubt {
  id: string;
  title: string;
  description: string;
  author: User;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  repliesCount: number;
  upvotes: number;
  assignedTo?: User;
  reply?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  subject: string;
  status: 'upcoming' | 'due-today' | 'overdue';
  type: 'assignment' | 'exam' | 'event' | 'other';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'participation' | 'helpfulness' | 'streak' | 'achievement';
  earned: boolean;
}

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  teacher: User;
  studentCount: number;
  color: string;
}

export interface FeedPost {
  id: string;
  type: 'announcement' | 'poll' | 'doubt' | 'feedback' | 'reminder' | 'recognition';
  title: string;
  content: string;
  author: User;
  createdAt: string;
  isPinned: boolean;
  likes: number;
  commentsCount: number;
  tags: string[];
}

export interface FeedbackEntry {
  id: string;
  rating: number;
  category: 'Teaching Pace' | 'Content Clarity' | 'Engagement' | 'Other';
  comment: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'image' | 'doc';
  subject: string;
  uploadedAt: string;
  size?: string;
  url: string;
}

export interface Notification {
  id: string;
  icon: string;
  message: string;
  timestamp: string;
  read: boolean;
  group: 'today' | 'this-week';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  badgeCount: number;
  points: number;
  rank: number;
}

export const mockTeacher: User = {
  id: '1', name: 'Dr. Sarah Chen', avatar: '', role: 'teacher', email: 'sarah.chen@school.edu',
};

export const mockStudent: User = {
  id: '2', name: 'Alex Rivera', avatar: '', role: 'student', email: 'alex.r@school.edu',
};

const student2: User = { id: '3', name: 'Jordan Kim', avatar: '', role: 'student', email: 'jordan.k@school.edu' };
const student3: User = { id: '4', name: 'Priya Patel', avatar: '', role: 'student', email: 'priya.p@school.edu' };
const student4: User = { id: '5', name: 'Marcus Johnson', avatar: '', role: 'student', email: 'marcus.j@school.edu' };

export const mockClasses: ClassInfo[] = [
  { id: '1', name: 'CS 101', subject: 'Intro to Computer Science', teacher: mockTeacher, studentCount: 45, color: 'announcement' },
  { id: '2', name: 'MATH 201', subject: 'Linear Algebra', teacher: mockTeacher, studentCount: 38, color: 'poll' },
  { id: '3', name: 'ENG 102', subject: 'Academic Writing', teacher: mockTeacher, studentCount: 32, color: 'feedback' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1', title: 'Midterm Exam Schedule Released', content: 'The midterm exam will be held on March 28th. Please review chapters 1-8 and complete all practice problems.',
    author: mockTeacher, createdAt: '2026-03-22T10:00:00Z', isPinned: true, priority: 'high', targetClasses: ['CS 101'],
    reactions: [{ emoji: '👍', count: 23 }, { emoji: '📚', count: 8 }], commentsCount: 5, isRead: false,
  },
  {
    id: '2', title: 'Guest Lecture Next Week', content: 'We have a special guest from Google joining us next Tuesday to discuss real-world software engineering.',
    author: mockTeacher, createdAt: '2026-03-21T14:30:00Z', isPinned: false, priority: 'medium', targetClasses: ['CS 101', 'MATH 201'],
    reactions: [{ emoji: '🎉', count: 34 }, { emoji: '🔥', count: 12 }], commentsCount: 12, isRead: true,
  },
  {
    id: '3', title: 'Lab Session Moved to Room 204', content: 'This week\'s lab session has been moved from Room 101 to Room 204 due to maintenance.',
    author: mockTeacher, createdAt: '2026-03-20T09:00:00Z', isPinned: false, priority: 'low', targetClasses: ['CS 101'],
    reactions: [{ emoji: '👍', count: 5 }], commentsCount: 2, isRead: true,
  },
];

export const mockPolls: Poll[] = [
  {
    id: '1', question: 'What day works best for office hours?',
    options: [
      { id: '1', text: 'Monday 3-5 PM', votes: 15 },
      { id: '2', text: 'Wednesday 2-4 PM', votes: 22 },
      { id: '3', text: 'Friday 1-3 PM', votes: 8 },
    ],
    author: mockTeacher, createdAt: '2026-03-20T09:00:00Z', expiresAt: '2026-03-25T23:59:00Z',
    isMultiChoice: false, totalVotes: 45, targetClasses: ['CS 101'], status: 'active',
  },
  {
    id: '2', question: 'Preferred project topic for the final assignment?',
    options: [
      { id: '1', text: 'Machine Learning App', votes: 18 },
      { id: '2', text: 'Web Application', votes: 25 },
      { id: '3', text: 'Mobile Game', votes: 12 },
      { id: '4', text: 'Data Visualization', votes: 9 },
    ],
    author: mockTeacher, createdAt: '2026-03-19T11:00:00Z', expiresAt: '2026-03-26T23:59:00Z',
    isMultiChoice: false, totalVotes: 64, targetClasses: ['CS 101'], status: 'active',
  },
];

export const mockDoubts: Doubt[] = [
  {
    id: '1', title: 'Confused about recursion vs iteration complexity',
    description: 'When should we prefer recursion over iteration in terms of time and space complexity?',
    author: mockStudent, category: 'Algorithms', priority: 'medium', status: 'open',
    createdAt: '2026-03-22T16:00:00Z', repliesCount: 2, upvotes: 8,
  },
  {
    id: '2', title: 'Binary tree traversal order',
    description: 'Can someone explain the difference between in-order, pre-order, and post-order traversal with examples?',
    author: student2, category: 'Data Structures', priority: 'high', status: 'in-progress',
    createdAt: '2026-03-21T11:00:00Z', repliesCount: 4, upvotes: 15, assignedTo: mockTeacher,
    reply: 'Great question! In-order traversal visits left subtree, root, then right subtree...',
  },
  {
    id: '3', title: 'How to handle edge cases in merge sort?',
    description: 'My merge sort implementation fails when the array has duplicate elements. How do I handle this?',
    author: student3, category: 'Algorithms', priority: 'low', status: 'resolved',
    createdAt: '2026-03-20T09:00:00Z', repliesCount: 3, upvotes: 5,
    reply: 'Make sure your merge function uses <= instead of < for the comparison.',
  },
  {
    id: '4', title: 'Difference between stack and heap memory',
    description: 'When should I allocate on stack vs heap? What are the performance implications?',
    author: student4, category: 'Systems', priority: 'medium', status: 'open',
    createdAt: '2026-03-22T14:00:00Z', repliesCount: 0, upvotes: 12,
  },
];

export const mockReminders: Reminder[] = [
  { id: '1', title: 'Assignment 5: Sorting Algorithms', description: 'Implement merge sort and quick sort', dueDate: '2026-03-24T23:59:00Z', className: 'CS 101', subject: 'Computer Science', status: 'due-today', type: 'assignment' },
  { id: '2', title: 'Midterm Exam', description: 'Chapters 1-8', dueDate: '2026-03-28T09:00:00Z', className: 'CS 101', subject: 'Computer Science', status: 'upcoming', type: 'exam' },
  { id: '3', title: 'Essay Draft Due', description: 'First draft of research essay', dueDate: '2026-03-22T23:59:00Z', className: 'ENG 102', subject: 'English', status: 'overdue', type: 'assignment' },
  { id: '4', title: 'Linear Algebra Quiz', description: 'Matrix operations and eigenvalues', dueDate: '2026-03-26T14:00:00Z', className: 'MATH 201', subject: 'Mathematics', status: 'upcoming', type: 'exam' },
  { id: '5', title: 'Science Fair Presentation', description: 'Prepare poster and demo', dueDate: '2026-03-30T10:00:00Z', className: 'CS 101', subject: 'Computer Science', status: 'upcoming', type: 'event' },
];

export const mockBadges: Badge[] = [
  { id: '1', name: 'Quick Responder', description: 'Answered 10 doubts within 1 hour', icon: '⚡', earnedAt: '2026-03-20', category: 'helpfulness', earned: true },
  { id: '2', name: '7-Day Streak', description: 'Active for 7 consecutive days', icon: '🔥', earnedAt: '2026-03-19', category: 'streak', earned: true },
  { id: '3', name: 'Top Contributor', description: 'Most helpful answers this week', icon: '⭐', earnedAt: '2026-03-18', category: 'achievement', earned: true },
  { id: '4', name: 'Poll Master', description: 'Participated in 20 polls', icon: '📊', earnedAt: '2026-03-15', category: 'participation', earned: true },
  { id: '5', name: 'Knowledge Seeker', description: 'Asked 50 questions', icon: '🎯', earnedAt: '', category: 'participation', earned: false },
  { id: '6', name: 'Mentor', description: 'Helped 25 classmates', icon: '🤝', earnedAt: '', category: 'helpfulness', earned: false },
  { id: '7', name: '30-Day Streak', description: 'Active for 30 consecutive days', icon: '💎', earnedAt: '', category: 'streak', earned: false },
  { id: '8', name: 'Perfect Score', description: 'Scored 100% on an exam', icon: '🏆', earnedAt: '', category: 'achievement', earned: false },
];

export const mockFeedPosts: FeedPost[] = [
  { id: '1', type: 'announcement', title: 'Midterm Exam Schedule Released', content: 'The midterm exam will be held on March 28th.', author: mockTeacher, createdAt: '2026-03-22T10:00:00Z', isPinned: true, likes: 23, commentsCount: 5, tags: ['CS 101', 'Exam'] },
  { id: '2', type: 'poll', title: 'Office Hours Preference', content: 'Vote for your preferred office hours timing.', author: mockTeacher, createdAt: '2026-03-21T14:30:00Z', isPinned: false, likes: 8, commentsCount: 3, tags: ['CS 101'] },
  { id: '3', type: 'doubt', title: 'Recursion vs Iteration', content: 'When should we prefer recursion?', author: mockStudent, createdAt: '2026-03-22T16:00:00Z', isPinned: false, likes: 5, commentsCount: 2, tags: ['Algorithms', 'CS 101'] },
  { id: '4', type: 'recognition', title: 'Alex earned Quick Responder badge!', content: 'Congratulations to Alex for answering 10 doubts within an hour!', author: mockTeacher, createdAt: '2026-03-20T12:00:00Z', isPinned: false, likes: 45, commentsCount: 8, tags: ['Recognition'] },
  { id: '5', type: 'reminder', title: 'Assignment 5 due tomorrow', content: 'Don\'t forget to submit your sorting algorithms implementation.', author: mockTeacher, createdAt: '2026-03-23T08:00:00Z', isPinned: false, likes: 2, commentsCount: 1, tags: ['CS 101', 'Assignment'] },
];

export const mockFeedback: FeedbackEntry[] = [
  { id: '1', rating: 5, category: 'Content Clarity', comment: 'The lecture on sorting algorithms was very well explained!', createdAt: '2026-03-22T10:00:00Z' },
  { id: '2', rating: 4, category: 'Teaching Pace', comment: 'Sometimes the pace is a bit fast for complex topics.', createdAt: '2026-03-21T14:00:00Z' },
  { id: '3', rating: 3, category: 'Engagement', comment: 'Would love more interactive coding exercises during class.', createdAt: '2026-03-20T09:00:00Z' },
  { id: '4', rating: 5, category: 'Content Clarity', comment: 'The visual explanations for tree traversal were excellent.', createdAt: '2026-03-19T11:00:00Z' },
  { id: '5', rating: 4, category: 'Other', comment: 'Great office hours sessions, very helpful!', createdAt: '2026-03-18T16:00:00Z' },
];

export const mockResources: Resource[] = [
  { id: '1', name: 'Chapter 1-4 Notes.pdf', type: 'pdf', subject: 'CS 101', uploadedAt: '2026-03-15', size: '2.4 MB', url: '#' },
  { id: '2', name: 'Sorting Algorithms Cheatsheet.pdf', type: 'pdf', subject: 'CS 101', uploadedAt: '2026-03-18', size: '1.1 MB', url: '#' },
  { id: '3', name: 'Matrix Operations Guide', type: 'link', subject: 'MATH 201', uploadedAt: '2026-03-10', url: '#' },
  { id: '4', name: 'Essay Writing Template.doc', type: 'doc', subject: 'ENG 102', uploadedAt: '2026-03-12', size: '340 KB', url: '#' },
  { id: '5', name: 'Data Structures Diagram.png', type: 'image', subject: 'CS 101', uploadedAt: '2026-03-20', size: '890 KB', url: '#' },
  { id: '6', name: 'Eigenvalue Tutorial', type: 'link', subject: 'MATH 201', uploadedAt: '2026-03-14', url: '#' },
];

export const mockNotifications: Notification[] = [
  { id: '1', icon: '📢', message: 'Dr. Chen posted a new announcement in CS 101', timestamp: '2026-03-24T09:00:00Z', read: false, group: 'today' },
  { id: '2', icon: '❓', message: 'Your doubt "Recursion vs Iteration" got a new reply', timestamp: '2026-03-24T08:30:00Z', read: false, group: 'today' },
  { id: '3', icon: '⏰', message: 'Assignment 5 is due in 24 hours!', timestamp: '2026-03-24T07:00:00Z', read: false, group: 'today' },
  { id: '4', icon: '🏆', message: 'You earned the "Quick Responder" badge!', timestamp: '2026-03-23T12:00:00Z', read: true, group: 'today' },
  { id: '5', icon: '📊', message: 'New poll: "Preferred project topic" is live', timestamp: '2026-03-22T11:00:00Z', read: true, group: 'this-week' },
  { id: '6', icon: '✅', message: 'Your doubt about merge sort was resolved', timestamp: '2026-03-21T16:00:00Z', read: true, group: 'this-week' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Alex Rivera', avatar: '', badgeCount: 8, points: 920, rank: 1 },
  { id: '2', name: 'Jordan Kim', avatar: '', badgeCount: 7, points: 870, rank: 2 },
  { id: '3', name: 'Priya Patel', avatar: '', badgeCount: 6, points: 810, rank: 3 },
  { id: '4', name: 'Marcus Johnson', avatar: '', badgeCount: 5, points: 760, rank: 4 },
  { id: '5', name: 'Sophie Williams', avatar: '', badgeCount: 4, points: 690, rank: 5 },
  { id: '6', name: 'Leo Zhang', avatar: '', badgeCount: 4, points: 650, rank: 6 },
];

export const weeklyEngagement = [
  { day: 'Mon', posts: 12, replies: 18, polls: 5 },
  { day: 'Tue', posts: 8, replies: 25, polls: 3 },
  { day: 'Wed', posts: 15, replies: 22, polls: 8 },
  { day: 'Thu', posts: 10, replies: 16, polls: 4 },
  { day: 'Fri', posts: 18, replies: 30, polls: 7 },
  { day: 'Sat', posts: 3, replies: 5, polls: 1 },
  { day: 'Sun', posts: 2, replies: 4, polls: 0 },
];
