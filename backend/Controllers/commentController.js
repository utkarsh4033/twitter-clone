import comments from '../model/Comments.js';
import users from '../model/Users.js';
import { validationResult } from 'express-validator';

export const createComment = async (req, res) => {
  const errors = validationResult(req);
  // validation error message
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed: ' + errors.array().map(e => e.msg).join(', ') });
  }
  const { comments_description, comments_posts_id } = req.body;

  if (!comments_description || !comments_posts_id) {
    return res.status(400).json({ message: 'Description and Post ID required' });
  }

  try {
    const comment = await comments.create({
      comments_description,
      comments_posts_id,
      comments_users_id: req.user.users_id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment', error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const postComments = await comments.findAll({
      where: {
        comments_posts_id: req.params.id,
        disabled: 0,
      },
       include: [
        {
          model: users,
          attributes: ['users_name', 'users_email'], // fetch only needed fields
        },
    ],
      order: [['comments_created_at', 'DESC']],
    });
      const formattedComments = postComments.map(comment => ({
      comments_id:comment.comments_id ,
      comments_description: comment.comments_description,
      comments_created_at: comment.comments_created_at,
      comments_users_id: comment.comments_users_id,
      users_name: comment.user?.users_name, 
      username: comment.user?.users_email,
    }));
    res.json(formattedComments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

export const updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed: ' + errors.array().map(e => e.msg).join(', ') });
  }
  const { comments_description } = req.body;

  try {
    const comment = await comments.findOne({
      where: {
        comments_id: req.params.id,
        disabled: 0,
      },
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.comments_users_id !== req.user.users_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.comments_description = comments_description || comment.comments_description;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await comments.findOne({
      where: {
        comments_id: req.params.id,
        disabled: 0,
      },
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.comments_users_id !== req.user.users_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.disabled = 1; 
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};
