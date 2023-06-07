import redis from "~~/utils/db";


export default defineEventHandler(async (event) => {

    const query = await getQuery(event)
    let orderData = await redis.hgetall(query.id);
    orderData[query.from][query.index].checked = (query.checked == "true");

    await redis.hset(query.id, orderData);
    return true;


})
