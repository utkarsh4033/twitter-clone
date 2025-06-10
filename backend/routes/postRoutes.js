import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
} from '../Controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { postValidation } from '../middleware/validateInput.js';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/my-posts', protect, getMyPosts);
router.get('/', getAllPosts);
router.get('/:id', getPostById);

router.post('/', protect, upload.single('posts_photo_url'), postValidation, createPost);
router.put('/:id', protect, upload.single('posts_photo_url'), postValidation, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
