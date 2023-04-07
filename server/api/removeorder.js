//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {
    //get query params
    const query = await getQuery(event)


    //push sample data to db
    // await redis.hset(2, "id", 2, "cost", 100, "time", "12:00", "aperitiv", [
    //     {
    //         "cty": 2,
    //         "title": "Salata de vinete",
    //         "price": 20,
    //         "options": "Cu branza",
    //         "checked": true
    //     },
    //     {
    //         "cty": 1,
    //         "title": "Salata de vinete",
    //         "price": 20,
    //         "options": "Cu branza"
    //     }
    // ], "main", [
    //     {
    //         "cty": 2,
    //         "title": "Salata de vinete",
    //         "price": 20,
    //         "options": "Cu branza"
    //     },
    //     {
    //         "cty": 1,
    //         "title": "Salata de vinete",
    //         "price": 20,
    //         "options": "Cu branza"
    //     }
    // ], "payment", "cash");
    await redis.lrem(query.class, 1, query.id)
    await redis.del(query.id);


    return true;


})
