//import upstash redis
import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv();

export default defineEventHandler(async (event) => {

    const query = await getQuery(event)
    let orderData = await redis.hgetall(query.id);
    orderData[query.from][query.index].checked = (query.checked == "true");

    await redis.hset(query.id, orderData);
    return true;


})
