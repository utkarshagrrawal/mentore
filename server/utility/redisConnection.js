const { createClient } = require('redis')

require('dotenv').config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const linkRedis = async () => {
    client.on("error", (error) => {
        console.error(error);
    })
    await client.connect();
}

const storeInRedis = async (key, value) => {
    await client.set(key, value, {
        EX: 60 * 60 * 24
    });
}

const checkInRedis = async (key) => {
    return await client.exists(key);
}

const getFromRedis = async (key) => {
    if (checkInRedis(key)) {
        return await client.get(key);
    }
    return null;
}

const deleteFromRedis = async (key) => {
    if (checkInRedis(key)) {
        return await client.del(key);
    }
    return null;
}

module.exports = {
    linkRedis,
    storeInRedis,
    checkInRedis,
    getFromRedis,
    deleteFromRedis
}