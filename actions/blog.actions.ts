'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/connect';
import BlogPost from '@/models/BlogPost.model';
import { validateBlogPostData, SerializedBlogPost, blogZodSchema } from '@/lib/validations/blog.schema';

export async function getBlogPosts(options?: { includeUnpublished?: boolean }): Promise<SerializedBlogPost[]> {
  try {
    await connectDB();

    const query: any = {};
    if (!options?.includeUnpublished) {
      query.published = true;
      query.publishedAt = { $lte: new Date() };
    }

    const posts = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).lean();
    return posts.map((post) => validateBlogPostData(post));
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string, options?: { includeUnpublished?: boolean }): Promise<SerializedBlogPost | null> {
  try {
    await connectDB();

    const query: any = { slug };
    if (!options?.includeUnpublished) {
      query.published = true;
      query.publishedAt = { $lte: new Date() };
    }

    const postDoc = await BlogPost.findOne(query).lean();
    if (!postDoc) return null;
    return validateBlogPostData(postDoc);
  } catch (error) {
    console.error(`Failed to fetch blog post by slug "${slug}":`, error);
    return null;
  }
}

export async function getBlogPostById(id: string): Promise<SerializedBlogPost | null> {
  try {
    await connectDB();
    const postDoc = await BlogPost.findById(id).lean();
    if (!postDoc) return null;
    return validateBlogPostData(postDoc);
  } catch (error) {
    console.error(`Failed to fetch blog post by id "${id}":`, error);
    return null;
  }
}

export async function createBlogPost(data: unknown) {
  try {
    await connectDB();
    const parsedData = blogZodSchema.parse(data);

    const existingPost = await BlogPost.findOne({ slug: parsedData.slug });
    if (existingPost) {
      return { success: false, error: 'A blog post with this slug already exists' };
    }

    const newPost = new BlogPost(parsedData);
    await newPost.save();
    
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    
    return { success: true, id: newPost._id.toString() };
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: string, data: unknown) {
  try {
    await connectDB();
    const parsedData = blogZodSchema.parse(data);

    const existingPost = await BlogPost.findOne({ slug: parsedData.slug, _id: { $ne: id } });
    if (existingPost) {
      return { success: false, error: 'Another blog post with this slug already exists' };
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, parsedData, { new: true }).lean();
    if (!updatedPost) {
      return { success: false, error: 'Blog post not found' };
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${parsedData.slug}`);
    revalidatePath('/admin/blog');
    
    return { success: true, id: updatedPost._id.toString() };
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return { success: false, error: error.message || 'Failed to update blog post' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await connectDB();
    const deletedPost = await BlogPost.findByIdAndDelete(id).lean();
    if (!deletedPost) {
      return { success: false, error: 'Blog post not found' };
    }

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}

export async function togglePublish(id: string, published: boolean) {
  try {
    await connectDB();
    const post = await BlogPost.findById(id);
    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    post.published = published;
    if (published && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    await post.save();

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/admin/blog');

    return { success: true };
  } catch (error: any) {
    console.error('Toggle publish error:', error);
    return { success: false, error: error.message || 'Failed to toggle publish status' };
  }
}
