import redis from "~~/utils/db";

export default defineEventHandler(async (event) => {

    const query = await getQuery(event)

    const section = query.section;
    const category = query.category;

    const price = query.price;
    const name = query.name;
    const description = query.description;

    const id = await redis.get("itemId");

    await redis.incr("itemId");
    const image = "https://pub-cf3223cf0a0a43dabb2ab85359b26cd5.r2.dev/" + name + ".png";
    await redis.hset(id, { "price": price, "name": name, "description": description, "image": image });
    const sectionData = await redis.hgetall(section);

    sectionData.categories[category].ids.push(id);
    await redis.hset(section, { "categories": sectionData.categories });

    return true;
})
