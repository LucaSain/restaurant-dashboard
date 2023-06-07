import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {
    //get query params
    const query = await getQuery(event)
    let orderData = await redis.hgetall(query.id);
    orderData[query.from].splice(query.index, 1);
    console.log(orderData);
    await redis.hset(query.id, orderData);

    return true;


})
