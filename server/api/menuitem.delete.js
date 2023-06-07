import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {
    //get query params

    const query = await getQuery(event)
    console.log(query.id);
    await redis.del(query.id);
    const section = await redis.hgetall(query.section);
    section.categories[query.category].ids.splice(section.categories[query.category].ids.indexOf(query.id), 1);
    await redis.hset(query.section, { "categories": section.categories });
    return true;
})
