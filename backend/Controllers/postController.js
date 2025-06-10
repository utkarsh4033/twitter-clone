import posts from '../model/Posts.js';
import users from '../model/Users.js';
import { validationResult } from 'express-validator';

export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed: ' + errors.array().map(e => e.msg).join(', ') });
  }

  const { posts_content } = req.body;

  if (!posts_content || posts_content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    // multer sets req.file when a file is uploaded
    const photoPath = req.file ? req.file.path : null;

    const post = await posts.create({
      posts_content,
      posts_photo_url: photoPath, // save file path as string
      posts_user_id: req.user.users_id, // authenticated user id
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({
      message: 'Failed to create post',
      error: err.message,
      stack: err.stack,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await posts.findAll({
      where: { disabled: 0 },
      include: [
        {
          model: users,
          attributes: ['users_name', 'users_email'],
        },
      ],
      order: [['posts_created_at', 'DESC']],
    });

    const formattedPosts = allPosts.map(post => ({
      posts_id: post.posts_id,
      posts_content: post.posts_content,
      posts_photo_url: post.posts_photo_url,
      posts_created_at: post.posts_created_at,
      posts_user_id: post.posts_user_id,
      users_name: post.user?.users_name,  
      username: post.user?.users_email,
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await posts.findOne({
      where: { posts_id: req.params.id, disabled: 0 },
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
};

export const updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed: ' + errors.array().map(e => e.msg).join(', ') });
  }

  const { posts_content } = req.body;
  try {
    const post = await posts.findOne({ where: { posts_id: req.params.id, disabled: 0 } });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Authorization check
    if (post.posts_user_id !== req.user.users_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // If new file uploaded, update photo path
    if (req.file) {
      post.posts_photo_url = req.file.path;
    }

    // Update content if provided
    post.posts_content = posts_content || post.posts_content;

    await post.save();

    res.json(post);
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await posts.findOne({ where: { posts_id: req.params.id, disabled: 0 } });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.posts_user_id !== req.user.users_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.disabled = 1;
    await post.save();

    res.json({ message: 'Post soft-deleted successfully' });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const myPosts = await posts.findAll({
      where: {
        posts_user_id: req.user.users_id,
        disabled: 0,
      },
      include: [
        {
          model: users,
          attributes: ['users_name', 'users_email'],
        },
      ],
      order: [['posts_created_at', 'DESC']],
    });

    res.json(myPosts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your posts', error: err.message });
  }
};

