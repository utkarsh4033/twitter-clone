import express from 'express';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../Controllers/commentController.js';

import { protect } from '../middleware/auth.js';
import { commentCreateValidation, commentUpdateValidation } from '../middleware/validateInput.js';

const router = express.Router();

router.get('/post/:id', getCommentsByPost);

router.post('/', protect, commentCreateValidation, createComment);
router.put('/:id', protect, commentUpdateValidation, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
