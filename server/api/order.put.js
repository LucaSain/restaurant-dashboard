import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {
    //get query params
    const query = await getQuery(event)
    await redis.lrem("curOrders", 1, query.id);
    await redis.lpush("completedOrders", query.id);

    return true;


})
