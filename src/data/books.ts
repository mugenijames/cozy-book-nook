export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  badge?: string;
  description: string;
  pages: number;
  publisher: string;
  publishDate: string;
  isbn: string;
  language: string;
  genre: string[];
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
}

export const books: Book[] = [
  {
    id: "midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 14.99,
    originalPrice: 18.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    badge: "Bestseller",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?\n\nA dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.",
    pages: 304,
    publisher: "Viking",
    publishDate: "September 29, 2020",
    isbn: "978-0525559474",
    language: "English",
    genre: ["Fiction", "Fantasy", "Contemporary"],
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    price: 16.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.\n\nIf you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.",
    pages: 320,
    publisher: "Avery",
    publishDate: "October 16, 2018",
    isbn: "978-0735211292",
    language: "English",
    genre: ["Self-Help", "Psychology", "Business"],
  },
  {
    id: "silent-patient",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    badge: "Sale",
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.\n\nAlicia's refusal to talk, or give any kind of explanation, turns a domestic tragedy into something far grander, a mystery that captures the public imagination and clings to them like a dark fairy tale.",
    pages: 336,
    publisher: "Celadon Books",
    publishDate: "February 5, 2019",
    isbn: "978-1250301697",
    language: "English",
    genre: ["Thriller", "Mystery", "Psychological Fiction"],
  },
  {
    id: "where-crawdads-sing",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 15.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    description: "For years, rumors of the \"Marsh Girl\" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say.\n\nSensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved.",
    pages: 384,
    publisher: "G.P. Putnam's Sons",
    publishDate: "August 14, 2018",
    isbn: "978-0735219106",
    language: "English",
    genre: ["Fiction", "Mystery", "Romance"],
  },
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 17.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=600&fit=crop",
    badge: "New",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.\n\nAll he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.",
    pages: 496,
    publisher: "Ballantine Books",
    publishDate: "May 4, 2021",
    isbn: "978-0593135204",
    language: "English",
    genre: ["Science Fiction", "Adventure", "Thriller"],
  },
  {
    id: "house-in-pines",
    title: "The House in the Pines",
    author: "Ana Reyes",
    price: 13.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    description: "Maya was a high school senior when she fell in love with Frank, a mysterious, handsome older man. Their whirlwind romance came to an abrupt end when Maya's best friend Aubrey mysteriously collapsed and died in Frank's presence.\n\nSeven years later, Maya is engaged and living in Boston, having moved on from the trauma—until a viral video changes everything. The clip shows a young woman suddenly dying in a diner, and Maya is shocked to recognize Frank at the counter nearby.",
    pages: 304,
    publisher: "Dutton",
    publishDate: "January 3, 2023",
    isbn: "978-0593185537",
    language: "English",
    genre: ["Thriller", "Mystery", "Suspense"],
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    bookId: "midnight-library",
    userName: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "December 15, 2025",
    title: "A beautiful exploration of life's possibilities",
    content: "This book made me cry, laugh, and think deeply about my own choices. Matt Haig has a way of making complex philosophical ideas accessible and deeply moving. The concept of the Midnight Library is brilliant, and Nora's journey is one that will stay with me forever.",
    helpful: 142,
  },
  {
    id: "r2",
    bookId: "midnight-library",
    userName: "James Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "November 28, 2025",
    title: "Life-changing perspective",
    content: "I picked this up during a difficult time in my life, and it was exactly what I needed. The message about appreciating the life you have while acknowledging the infinite possibilities is powerful. Beautifully written and emotionally resonant.",
    helpful: 98,
  },
  {
    id: "r3",
    bookId: "midnight-library",
    userName: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 4,
    date: "October 12, 2025",
    title: "Thought-provoking but slightly predictable",
    content: "While I loved the concept and found the writing beautiful, some of the plot points were a bit predictable. That said, the emotional depth and the philosophical questions it raises make it a worthwhile read. Would still recommend it to anyone going through a rough patch.",
    helpful: 67,
  },
  {
    id: "r4",
    bookId: "atomic-habits",
    userName: "Michael Torres",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    date: "December 1, 2025",
    title: "Practical and transformative",
    content: "Unlike other self-help books that are all theory, this one gives you actionable steps. I've implemented the habit stacking technique and it's genuinely changed my daily routine. The 1% improvement philosophy is simple but profound.",
    helpful: 234,
  },
  {
    id: "r5",
    bookId: "silent-patient",
    userName: "Amanda Foster",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    date: "November 5, 2025",
    title: "Did NOT see that coming!",
    content: "I consider myself pretty good at predicting thriller twists, but this one got me. The ending left me staring at the wall for a good 10 minutes. Brilliantly crafted psychological thriller that keeps you guessing until the very last page.",
    helpful: 189,
  },
];

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};

export const getReviewsByBookId = (bookId: string): Review[] => {
  return reviews.filter((review) => review.bookId === bookId);
};
