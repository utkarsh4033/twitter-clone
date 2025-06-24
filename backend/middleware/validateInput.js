import { body } from "express-validator"
import posts from '../model/Posts.js'

export const registerValidation = [
  body('users_name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('users_email').isEmail().withMessage('Valid email required'),
 body('users_password')
  .isLength({ min: 6 })
  .matches(/[\W0-9]/)
  .withMessage('Password must be at least 6 characters and include symbols or numbers'),

];

export const loginValidation = [
  body('users_email').isEmail().withMessage('Valid email required'),
  body('users_password').notEmpty().withMessage('Password is required'),
];

export const postValidation = [
  body('posts_content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 5, max: 280 }).withMessage('Content must be 5-280 characters')
    .custom((value) => value.replace(/<[^>]*>?/gm, '') === value).withMessage('No HTML tags allowed')
    .custom((value) => value.trim().length > 0).withMessage('Content cannot be whitespace only'),
];

export const commentCreateValidation = [
  body('comments_description')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 2, max: 200 }).withMessage('Comment must be 2-200 characters')
    .custom((value) => value.replace(/<[^>]*>?/gm, '') === value).withMessage('No HTML tags allowed')
    .custom((value) => value.trim().length > 0).withMessage('Comment cannot be whitespace only'),
  // body('comments_posts_id')
  //   .notEmpty().withMessage('Post ID is required')
  //   .isInt().withMessage('Post ID must be an integer')
  //   .custom(async (value) => {
  //     const posts = (await import('../model/Posts.js')).default;
  //     const post = await posts.findByPk(value);
  //     if (!post || post.disabled === 1) {
  //       throw new Error('Post ID does not reference an existing post');
  //     }
  //     return true;
  //   }),
];

export const commentUpdateValidation = [
  body('comments_description')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 2, max: 200 }).withMessage('Comment must be 2-200 characters')
    .custom((value) => value.replace(/<[^>]*>?/gm, '') === value).withMessage('No HTML tags allowed')
    .custom((value) => value.trim().length > 0).withMessage('Comment cannot be whitespace only'),
];