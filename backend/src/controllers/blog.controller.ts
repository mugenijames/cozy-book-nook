import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/*
 * PUBLIC: Get published blog posts
 */
export const getPublishedBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog posts.",
    });
  }
};

/*
 * PUBLIC: Get one published blog by slug
 */
export const getPublishedBlogBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    const blog = await prisma.blogPost.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog post.",
    });
  }
};

/*
 * ADMIN: Get all blog posts
 */
export const getAllBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog posts.",
    });
  }
};

/*
 * ADMIN: Create blog post
 */
export const createBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      readingTime,
      published,
      featured,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        error: "Title, slug and content are required.",
      });
    }

    const existingBlog = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
    });

    if (existingBlog) {
      return res.status(409).json({
        success: false,
        error: "A blog post with this slug already exists.",
      });
    }

    const shouldPublish = Boolean(published);

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category: category || null,
        tags: tags || null,
        author: author || req.user?.name || null,
        readingTime: readingTime || null,
        published: shouldPublish,
        featured: Boolean(featured),
        publishedAt: shouldPublish ? new Date() : null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create blog post.",
    });
  }
};

/*
 * ADMIN: Update blog post
 */
export const updateBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      readingTime,
      published,
      featured,
      seoTitle,
      seoDescription,
    } = req.body;

    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(409).json({
          success: false,
          error: "Another blog post already uses this slug.",
        });
      }
    }

    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (slug !== undefined) {
      updateData.slug = slug;
    }

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (tags !== undefined) {
      updateData.tags = tags;
    }

    if (author !== undefined) {
      updateData.author = author;
    }

    if (readingTime !== undefined) {
      updateData.readingTime = readingTime;
    }

    if (featured !== undefined) {
      updateData.featured = Boolean(featured);
    }

    if (seoTitle !== undefined) {
      updateData.seoTitle = seoTitle;
    }

    if (seoDescription !== undefined) {
      updateData.seoDescription = seoDescription;
    }

    if (published !== undefined) {
      const newPublished = Boolean(published);

      updateData.published = newPublished;

      if (newPublished && !existingBlog.published) {
        updateData.publishedAt = new Date();
      }

      if (!newPublished) {
        updateData.publishedAt = null;
      }
    }

    const blog = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully.",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to update blog post.",
    });
  }
};

/*
 * ADMIN: Delete blog post
 */
export const deleteBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to delete blog post.",
    });
  }
};

/*
 * ADMIN: Publish / unpublish blog post
 */
export const toggleBlogPublished = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const existingBlog = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found.",
      });
    }

    const published = !existingBlog.published;

    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    return res.status(200).json({
      success: true,
      message: published
        ? "Blog post published successfully."
        : "Blog post unpublished successfully.",
      blog,
    });
  } catch (error) {
    console.error(
      "Error changing blog publication status:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to change blog publication status.",
    });
  }
};