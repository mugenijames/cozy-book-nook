import { z } from 'zod';

// Helper for current year
const CURRENT_YEAR = new Date().getFullYear();

// Base schema
const bookBaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title cannot exceed 200 characters' })
    .trim(),

  author: z
    .string()
    .min(1, { message: 'Author is required' })
    .max(100, { message: 'Author name cannot exceed 100 characters' })
    .trim(),

  description: z
    .string()
    .max(2000, { message: 'Description cannot exceed 2000 characters' })
    .optional()
    .nullable()
    .transform((val) => (val?.trim() || null)),

  genre: z
    .string()
    .max(50, { message: 'Genre cannot exceed 50 characters' })
    .optional()
    .nullable()
    .transform((val) => (val?.trim() || null)),

  coverImage: z
    .string()
    .url({ message: 'Cover image must be a valid URL' })
    .optional()
    .nullable(),

  publishedYear: z
    .number()
    .int({ message: 'Published year must be an integer' })
    .min(1000, { message: 'Published year must be 1000 or later' })
    .max(CURRENT_YEAR + 1, { message: `Published year cannot be later than ${CURRENT_YEAR + 1}` })
    .optional()
    .nullable(),

  pages: z
    .number()
    .int({ message: 'Pages must be an integer' })
    .positive({ message: 'Pages must be a positive number' })
    .optional()
    .nullable(),

  rating: z
    .number()
    .min(0, { message: 'Rating cannot be negative' })
    .max(5, { message: 'Rating cannot exceed 5' })
    .optional()
    .default(0),
});

// Create & Update schemas remain the same
export const createBookSchema = bookBaseSchema
  .extend({})
  .required({ title: true, author: true });

export const updateBookSchema = bookBaseSchema.partial();

// Types (optional but useful)
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;