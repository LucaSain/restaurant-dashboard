//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {



    const id = await redis.get("itemId");

    await redis.incr("itemId");


    return id;
})
