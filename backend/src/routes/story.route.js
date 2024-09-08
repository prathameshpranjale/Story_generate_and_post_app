import express from 'express';
import { generateStory, postStory } from '../controllers/story.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/generate-story').post(verifyJWT, generateStory);  // For generating a story
router.route('/post-story/:storyId').put(verifyJWT, postStory);  // For posting the story

export default router;
