import axios from 'axios';  // To communicate with the Flask app (AI model)
import { Story } from '../models/story.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


const generateStory = asyncHandler(async (req, res) => {
    const { title, userInput, storyType } = req.body;

    // Validate input
    if (!title || !userInput || !storyType) {
        return res.status(400).json({
            success: false,
            message: "Title, userInput, and storyType are required",
        });
    }

    try {
        // Call Flask API to generate story content using the AI model
        const response = await axios.post('http://127.0.0.1:5000/generate', {
            user_input: userInput,
            story_type: storyType
        });

        // Check if the response has the expected structure
        if (!response.data || !response.data.response) {
            throw new Error('Invalid response structure from Flask server');
        }

        const generatedContent = response.data.response;  // Get AI-generated content

        // Store the generated story as a draft
        const story = await Story.create({
            title,
            content: generatedContent,  // Store the generated content from AI
            author: null, // Placeholder for author if not authenticated
            isPosted: false,  // Initially, story is not posted
        });

        res.status(201).json({
            success: true,
            data: story,
            message: "Story generated and saved as draft successfully",
        });

    } catch (error) {
        console.error("Error generating story:", error.message || error);
        res.status(500).json({
            success: false,
            message: `Failed to generate story: ${error.message || error}`,
        });
    }
});


// Handler to post the story
const postStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    // Update the story to mark it as posted
    story.isPosted = true;
    story.postedAt = Date.now();
    await story.save();

    res.status(200).json({
        success: true,
        data: story,
        message: "Story posted successfully",
    });
});

export {
    generateStory,
    postStory
};