//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {
    //get query params

    const query = await getQuery(event)
    const section = await redis.hgetall(query.section);
    const category = section.categories[query.category];
    //delete all the items in the category
    for (let i = 0; i < category.ids.length; i++) {
        await redis.del(category.ids[i]);
    }
    //delete the category
    section.categories.splice(query.category, 1);
    await redis.hset(query.section, { "categories": section.categories });
    return true;
})
