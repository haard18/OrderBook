import RedisManager from './RedisManager';

const redisManager = new RedisManager();

const key = 'match1';
const initialInMatch = { "virat Kohli": 100, "Player2": 80, "Player3": 90 };

// Initialize the in-match data and then perform multiple increments and decrements
async function runOperations() {
    try {
        // Initialize in-match data
        await redisManager.initInMatchData(key, initialInMatch);

        // Perform multiple increment and decrement operations
        await redisManager.incrementPlayerStock(key, 'virat Kohli', 10);
        await redisManager.incrementPlayerStock(key, 'Player2', 20);
        await redisManager.decrementPlayerStock(key, 'Player3', 15);
        await redisManager.incrementPlayerStock(key, 'Player3', 5);
        await redisManager.decrementPlayerStock(key, 'Player2', 10);

        // Retrieve and log data after all operations
        const data = await redisManager.getInMatchData(key);
        console.log('Data after all operations:', data);
    } catch (error) {
        console.error('Error during operations:', error);
    }
}

// Run the operations
runOperations();
