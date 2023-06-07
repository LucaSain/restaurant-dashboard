<script setup>




const open = ref(false);
const emit = defineEmits(['update', 'remove']);
const props = defineProps(['orderID', 'type', "orderDatas"]);
let od;
let ids, tps;
if (props.orderID !== undefined) {
    od = await $fetch('/api/order?id=' + props.orderID);
    ids = props.orderID;

}
else {
    od = props.orderDatas;
    ids = props.orderDatas.id;
}
tps = props.type;



const orderData = ref(od);
console.log(orderData.value, props.orderID);


const removeOrder = async () => {

    await $fetch('/api/order?id=' + ids + '&class=' + ((tps === 'current') ? 'curOrders' : 'completedOrders'), { method: "DELETE" });
    emit('remove', orderData.value);
    open.value = false;
}
const completeOrder = async () => {
    await $fetch('/api/order?id=' + ids, { method: "PUT" });
    emit('update', orderData.value);
    open.value = false;
}
const removeItemFromOrder = async (item, from) => {
    let index = orderData.value[from].indexOf(item);
    await $fetch('/api/item?id=' + ids + "&index=" + index + "&from=" + from, { method: "DELETE" });
    orderData.value[from].splice(index, 1);
    item.swapChecked = false;
}

const updateCheckBox = async (item, from, e) => {
    let index = orderData.value[from].indexOf(item);
    await $fetch('/api/updatecheckbox?id=' + ids + "&index=" + index + "&from=" + from + "&checked=" + e);

}
if (orderData.value.aperitive)
    orderData.value.aperitive.forEach(item => {
        item.swapChecked = false;

    });
if (orderData.value.main)
    orderData.value.main.forEach(item => {
        item.swapChecked = false;

    });
if (orderData.value.desert)
    orderData.value.desert.forEach(item => {
        item.swapChecked = false;

    });
if (orderData.value.drinks)
    orderData.value.drinks.forEach(item => {
        item.swapChecked = false;

    });




</script>
<template>
    <div class="w-full">
        <div v-if="!open" @click="open = !open" class="hover:bg-base-300 alert shadow-lg">
            <div class="flex items-center w-full">
                <div class="text-lg">{{ orderData.time }}</div>
                <h2 class="text-2xl">{{ "Order nr." + orderData.id }}</h2>
                <div class="flex flex-1 justify-center">
                    <div class="flex gap-2">
                        <div v-if="orderData.aperitive.length" class="badge badge-primary">Aperitiv</div>
                        <div v-if="orderData.main.length" class="badge badge-error">Main Course</div>
                        <div v-if="orderData.desert.length" class="badge badge-info">Desert</div>
                        <div v-if="orderData.drinks.length" class="badge badge-secondary">Drinks</div>
                    </div>
                </div>
                <div class="text-lg">{{ orderData.payment }}</div>
                <div class="text-xl">{{ orderData.cost }} lei</div>
            </div>
        </div>
        <div class=" w-full h-max bg-base-200 shadow-lg rounded-xl" v-if="open">
            <div @click="open = !open" class="hover:bg-base-300 alert shadow-lg">
                <div class="flex items-center w-full">
                    <div class="text-lg">{{ orderData.time }}</div>
                    <h2 class="text-2xl">{{ "Order nr." + orderData.id }}</h2>
                    <div class="flex-1"></div>
                    <div class="text-lg">{{ orderData.payment }}</div>
                    <div class="text-xl">{{ orderData.cost }} lei</div>
                </div>
            </div>
            <div class="flex flex-row mt-4 p-4">
                <div class="w-full flex flex-col pl-4 gap-2">

                    <div v-if="orderData.aperitive.length" class="ml-3 mb-1 badge badge-lg text-xl badge-primary">Aperitiv
                    </div>
                    <div v-for="item in orderData.aperitive" class="flex flex-row items-center gap-3">
                        <input @change="updateCheckBox(item, 'aperitive', $event.target.checked)" type="checkbox"
                            :checked="item.checked" class="checkbox-primary checkbox checkbox-lg">
                        <div class="text-xl">{{ item.cty }} </div>
                        <div class="text-xl">{{ item.name }}</div>
                        <div v-if="item.options" class="text-xl text-gray-700 underline underline-offset-auto">{{
                            item.options }}</div>

                        <div class="flex-1"></div>
                        <label v-if="type === 'current'" class="swap">

                            <input type="checkbox"
                                @change="item.swapChecked === true ? removeItemFromOrder(item, 'aperitive') : item.swapChecked = true" />

                            <div class="swap-off fill-current text-xl">{{ item.price }} lei</div>


                            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                viewBox="0 0 512 512">
                                <polygon
                                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                            </svg>

                        </label>
                        <div v-else class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                    </div>


                    <div v-if="orderData.main.length" class="ml-3 mb-1 badge badge-lg text-xl badge-error mt-2">Main
                        Course</div>
                    <div v-for="item in orderData.main" class="flex flex-row items-center gap-3">
                        <input @change="updateCheckBox(item, 'main', $event.target.checked)" type="checkbox"
                            class="checkbox-error checkbox checkbox-lg" :checked="item.checked">
                        <div class="text-xl">{{ item.cty }} </div>
                        <div class="text-xl">{{ item.name }}</div>
                        <div v-if="item.options" class="text-xl text-gray-700 underline underline-offset-auto">{{
                            item.options }}</div>

                        <div class="flex-1"></div>
                        <label v-if="type === 'current'" class="swap">

                            <!-- this hidden checkbox controls the state -->
                            <input type="checkbox"
                                @change="item.swapChecked === true ? removeItemFromOrder(item, 'main') : item.swapChecked = true" />

                            <!-- sun icon -->
                            <div class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                            <!-- close icon -->
                            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                viewBox="0 0 512 512">
                                <polygon
                                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                            </svg>

                        </label>
                        <div v-else class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                    </div>

                    <div v-if="orderData.desert.length" class="ml-3 mb-1 badge badge-lg text-xl badge-info mt-2">Desert
                    </div>
                    <div v-for="item in orderData.desert" class="flex flex-row items-center gap-3">
                        <input @change="updateCheckBox(item, 'desert', $event.target.checked)" type="checkbox"
                            :checked="item.checked" class="checkbox-info checkbox checkbox-lg">
                        <div class="text-xl">{{ item.cty }} </div>
                        <div class="text-xl">{{ item.name }}</div>
                        <div v-if="item.options" class="text-xl text-gray-700 underline underline-offset-auto">{{
                            item.options }}</div>

                        <div class="flex-1"></div>
                        <label v-if="type === 'current'" class="swap">

                            <!-- this hidden checkbox controls the state -->
                            <input type="checkbox"
                                @change="item.swapChecked === true ? removeItemFromOrder(item, 'desert') : item.swapChecked = true" />

                            <!-- sun icon -->
                            <div class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                            <!-- close icon -->
                            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                viewBox="0 0 512 512">
                                <polygon
                                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                            </svg>

                        </label>
                        <div v-else class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                    </div>

                    <div v-if="orderData.drinks.length" class="ml-3 mb-1 badge badge-lg text-xl badge-secondary mt-2">
                        Drinks
                    </div>
                    <div v-for="item in orderData.drinks" class="flex flex-row items-center gap-3">
                        <input @change="updateCheckBox(item, 'drinks', $event.target.checked)" type="checkbox"
                            :checked="item.checked" class="checkbox-secondary checkbox checkbox-lg">

                        <div class="text-xl">{{ item.name }}</div>
                        <div v-if="item.option" class="text-xl text-gray-700 underline underline-offset-auto">{{
                            item.option }}</div>

                        <div class="flex-1"></div>
                        <label v-if="type === 'current'" class="swap">

                            <!-- this hidden checkbox controls the state -->
                            <input type="checkbox"
                                @change="item.swapChecked === true ? removeItemFromOrder(item, 'drinks') : item.swapChecked = true" />

                            <!-- sun icon -->
                            <div class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                            <!-- close icon -->
                            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                viewBox="0 0 512 512">
                                <polygon
                                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                            </svg>

                        </label>
                        <div v-else class="swap-off fill-current text-xl">{{ item.price }} lei</div>

                    </div>

                    <div class="relative flex flex-row pb-2 w-full mt-4">
                        <button v-if="type === 'current'" @click="completeOrder" class="btn flex-1">Complete</button>
                        <div v-else class="flex-1"></div>
                        <button @click="removeOrder" class="flex-none ml-20 btn btn-error">Delete</button>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
