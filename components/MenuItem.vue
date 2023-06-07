<script setup>
//add sucategorii

const props = defineProps(['id', 'itemData', 'category', 'section']);
const emit = defineEmits(['update', 'delete']);
let itemData = props.itemData;
if (!itemData)
    itemData = await fetch('/api/menuitem?id=' + props.id).then(res => res.json());
//delete item from both api and local
const Delete = async () => {


    await $fetch('/api/menuitem?id=' + (props.id ? props.id : itemData.id) + '&section=' + props.section + '&category=' + props.category, { method: "DELETE" });
    emit('delete', props.id, props.section, props.category);
}
</script>

<template>
    <div class="w-full h-max bg-base-200 z-0 rounded-lg relative flex justify-center items-center">

        <div
            class=" rounded-lg w-full h-full min-h-64 z-20 absolute bg-base-100 bg-opacity-10 flex flex-col p-2 bg-gradient-to-br from-neutral  to-transparent">
            <h1 class="text-3xl text-white">{{ itemData.name }}</h1>
            <p class="text-xl text-white">{{ itemData.price }}</p>
            <div class="flex-1"></div>
            <div class="flex flex-row gap-2">
                <label :for="itemData.id" class="btn">Info</label>
                <button @click="Delete()" class="btn btn-error btn-sm h-full">Del</button>
            </div>
        </div>
        <img class="z-0 relative rounded-lg " :src="itemData.image" />
    </div>
    <input type="checkbox" :id="itemData.id" class="modal-toggle" />
    <label :for="itemData.id" class="modal cursor-pointer">
        <label class="modal-box relative" for="">
            <h3 class="text-lg font-bold">{{ itemData.title }}</h3>
            <p class="py-4">{{ itemData.description }}</p>
            <button @click="Delete()" class="btn btn-error">Delete</button>
        </label>
    </label>
</template>