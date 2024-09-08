import cron from 'node-cron';
import { Story } from '../models/story.model.js'; // Adjust the import based on your file structure

// Scheduled task to run every minute
cron.schedule('0 * * * *', async () => {
    try {
        await Story.deleteMany({ isPosted: false, createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) } });
        console.log('Unposted stories older than 1 hour have been deleted');
    } catch (error) {
        console.error('Error during scheduled cleanup:', error);
    }
});
