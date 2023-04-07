//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {
    //get query params
    const body = await readBody(event);
    await redis.hset(body.id, { ...body });
    await redis.lpush('curOrders', body.id);

    return true;
})
