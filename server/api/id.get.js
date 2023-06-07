import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {



    const id = await redis.get("itemId");

    await redis.incr("itemId");


    return id;
})
