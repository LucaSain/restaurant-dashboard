//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {
    const query = await getQuery(event)
    const section = query.section;
    const category = query.category;
    console.log(section, category);
    const sectionData = await redis.hgetall(section);
    sectionData.categories.push({ "name": category, "ids": [] });
    await redis.hset(section, { "categories": sectionData.categories });
    return true;
})
