import mongoose, { Schema } from "mongoose";


const storySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Story title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        content: {
            type: String,
            required: [true, "Story content is required"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        mediaUrls: [String],
        isPosted: {
            type: Boolean,
            default: false,
        },
        postedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

storySchema.pre('save', async function (next) {
    if (this.isPosted && !this.postedAt) {
        this.postedAt = Date.now();
    }
    next();
});


export const Story = mongoose.model('Story', storySchema);