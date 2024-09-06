import { createClient, RedisClientType } from 'redis';

class RedisManager {
    private client: RedisClientType;

    constructor() {
        this.client = createClient();
        this.client.connect().catch((err) => console.error('Redis Connection Error:', err));

        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });

        this.client.on('error', (err) => {
            console.error('Redis Error:', err);
        });
    }

    // Initialize in-match data
    async initInMatchData(key: string, initialData: Record<string, number>): Promise<void> {
        try {
            const existingData = await this.getInMatchData(key);

            if (!existingData) {
                // If no data exists for the key, set the initial data
                await this.setInMatchData(key, initialData);
                console.log('Initialized in-match data:', initialData);
            } else {
                console.log('In-match data already initialized:', existingData);
            }
        } catch (err) {
            console.error('Error initializing in-match data:', err);
        }
    }

    // Set in-match data (used to update Redis data)
    private async setInMatchData(key: string, data: Record<string, number>): Promise<void> {
        try {
            const stringifiedData = JSON.stringify(data);
            await this.client.set(key, stringifiedData);
            console.log(`Data written to Redis with key: ${key}`);
        } catch (err) {
            console.error('Error writing to Redis:', err);
        }
    }

    // Retrieve in-match data from Redis
    async getInMatchData(key: string): Promise<Record<string, number> | null> {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error('Error retrieving data from Redis:', err);
            return null;
        }
    }

    // Increment player's stock value (fetches current data from Redis before updating)
    async incrementPlayerStock(key: string, playerName: string, incrementBy: number): Promise<void> {
        try {
            let data = await this.getInMatchData(key);
            if (data) {
                data[playerName] = (data[playerName] || 0) + incrementBy;
                await this.setInMatchData(key, data);
                console.log(`${playerName}'s stock increased to ${data[playerName]}`);
            } else {
                console.log(`No data found for key: ${key}`);
            }
        } catch (err) {
            console.error('Error incrementing player stock:', err);
        }
    }

    // Decrement player's stock value (fetches current data from Redis before updating)
    async decrementPlayerStock(key: string, playerName: string, decrementBy: number): Promise<void> {
        try {
            let data = await this.getInMatchData(key);
            if (data) {
                data[playerName] = Math.max(0, (data[playerName] || 0) - decrementBy);
                await this.setInMatchData(key, data);
                console.log(`${playerName}'s stock decreased to ${data[playerName]}`);
            } else {
                console.log(`No data found for key: ${key}`);
            }
        } catch (err) {
            console.error('Error decrementing player stock:', err);
        }
    }

    // Clear all data in Redis
    async clearAllData(): Promise<void> {
        try {
            await this.client.flushAll();
            console.log('All data cleared from Redis');
        } catch (err) {
            console.error('Error clearing all data from Redis:', err);
        }
    }
}

export default RedisManager;
