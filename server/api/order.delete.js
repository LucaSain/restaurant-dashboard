import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {
    //get query params
    const query = await getQuery(event)

    await redis.lrem(query.class, 1, query.id)
    await redis.del(query.id);


    return true;


})
