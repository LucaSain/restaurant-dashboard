<script setup>
const fileInputRef = ref(null);
const title = ref(null);
const price = ref(null);
const description = ref(null);
const imageSrc = ref('https://via.placeholder.com/150');
const props = defineProps(['section', 'category']);
const emit = defineEmits(['create']);
function handleFileChange(e) {
    const file = e.files[0];
    fileInputRef.value = e;
    if (file) {
        imageSrc.value = URL.createObjectURL(file);
    }
}
function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
        !isNaN(parseFloat(str))
}
async function uploadFile() {
    const file = fileInputRef.value.files[0];

    if (!file) {
        return;
    }
    if (title.value == null || price.value == null || description.value == null) {
        alert("Please fill in all the fields");
        return;
    }
    if (!isNumeric(price.value)) {
        alert("please input a valid price!")
        return;
    }

    let id = await fetch("/api/id").then(async res => await res.json());
    id += 1;
    emit("create", { id: id, name: title.value, price: price.value, description: description.value, section: props.section, category: props.category, image: imageSrc.value });

    try {
        await $fetch('/api/menuitem?name=' + title.value + "&price=" + price.value + "&description=" + description.value + '&section=' + props.section + "&category=" + props.category + "&ctype=" + file.type, { method: "POST" })
        const response = await fetch('https://restaurant.acamponezaworker.workers.dev/' + title.value + '.png', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': file.type,
            },
            body: file,
        });
        resetEverything();
    } catch (error) {
        alert("Something went wrong, please try again later.");
        resetEverything();
        console.log(error);
    }
}


function resetEverything() {
    title.value = null;
    price.value = null;
    description.value = null;
    fileInputRef.value = null;
}
</script>

<template>
    <label :for="section + category + 'modal'"
        class="min-h-64 w-full h-max bg-base-200 hover:bg-white rounded-lg min-h-full flex justify-center items-center border-4 border-dashed border-base-100 flex-col">
        <div class="text-8xl text-base-100">+</div>
        <div class="text-xl text-base-100">Add a new item</div>
    </label>
    <input type="checkbox" :id="section + category + 'modal'" class="modal-toggle" />
    <label :for="section + category + 'modal'" class="modal cursor-pointer">
        <label class="modal-box relative">
            <div class="flex flex-row w-full">
                <div class="flex flex-col grow mr-2 gap-2">
                    <input @change="title = $event.target.value" type="text"
                        class="rounded-none outline-none text-lg font-bold bg-base-100 border-b-2 border-base-300 w-full"
                        placeholder="New item" />

                    <input @change="price = $event.target.value" type="number"
                        class="rounded-none outline-none text-lg font-bold bg-base-100 border-b-2 border-base-300 w-1/2"
                        placeholder="Price" />
                    <p class="pt-8 texgt-xl font-medium">Description: </p>
                </div>
                <label :for="section + category + 'img'">
                    <img :src="imageSrc" class="w-32 h-32 rounded-lg" />
                    <input type="file" :id="section + category + 'img'" @change="handleFileChange($event.target)"
                        class="hidden" accept="image/png, image/gif, image/jpeg" />
                </label>
            </div>
            <textarea @change="description = $event.target.value"
                class="outline-none mt-2 p-2 bg-base-200 w-full min-h-32 rounded-lg"></textarea>
            <div class="flex flex-row gap-2 w-full mt-2">
                <label class="btn btn-error" :for="section + category + 'modal'">Cancel</label>
                <div class="flex-1"></div>
                <label class="btn btn-primary" :for="section + category + 'modal'" @click="uploadFile">Save</label>
            </div>
        </label>
    </label>
</template>