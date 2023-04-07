//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {
    //get query params
    const query = await getQuery(event)

    return await redis.hgetall(query.id);
})
