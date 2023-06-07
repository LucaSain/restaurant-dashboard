import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {
    //get query params


    const curOrders = await redis.lrange("curOrders", 0, -1);
    const completedOrders = await redis.lrange("completedOrders", 0, -1);

    return {
        curOrders,
        completedOrders,
    }


})
