import express from 'express';
import { generateStory, postStory } from '../controllers/story.controller.js';

const router = express.Router();

router.post('/generate-story', generateStory);  // For generating a story
router.put('/post-story/:storyId', postStory);  // For posting the story

export default router;
