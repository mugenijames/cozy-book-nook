import { Router } from "express";

import {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublished,
} from "../controllers/blog.controller";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

/*
 * ============================================================
 * PUBLIC BLOG ROUTES
 * ============================================================
 */

/*
 * GET /api/blogs
 * Get all published blog posts
 */
router.get("/", getPublishedBlogs);

/*
 * GET /api/blogs/:slug
 * Get one published blog post
 *
 * IMPORTANT:
 * Keep this route AFTER the admin routes if admin
 * routes are defined in this same router.
 */


/*
 * ============================================================
 * ADMIN BLOG ROUTES
 * ============================================================
 */

/*
 * GET /api/blogs/admin/all
 * Get all blog posts including unpublished posts
 */
router.get(
  "/admin/all",
  authenticate,
  requireAdmin,
  getAllBlogs
);

/*
 * POST /api/blogs/admin
 * Create a new blog post
 */
router.post(
  "/admin",
  authenticate,
  requireAdmin,
  createBlog
);

/*
 * PATCH /api/blogs/admin/:id
 * Update a blog post
 */
router.patch(
  "/admin/:id",
  authenticate,
  requireAdmin,
  updateBlog
);

/*
 * DELETE /api/blogs/admin/:id
 * Delete a blog post
 */
router.delete(
  "/admin/:id",
  authenticate,
  requireAdmin,
  deleteBlog
);

/*
 * PATCH /api/blogs/admin/:id/publish
 * Publish or unpublish a blog post
 */
router.patch(
  "/admin/:id/publish",
  authenticate,
  requireAdmin,
  toggleBlogPublished
);


/*
 * ============================================================
 * PUBLIC SINGLE BLOG ROUTE
 * ============================================================
 */

/*
 * GET /api/blogs/:slug
 * Get one published blog post by slug
 */
router.get(
  "/:slug",
  getPublishedBlogBySlug
);

export default router;