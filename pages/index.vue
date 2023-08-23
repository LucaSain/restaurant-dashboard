<script setup>
import * as Ably from 'ably'
let od = await $fetch('/api/orders');//
let orders = ref(od);
const RTCurOrders = ref([]);
const RTCompletedOrders = ref([]);
const tabindex = ref(0);

const updateOrders = (orderData) => {
    orders.value.curOrders.splice(orders.value.curOrders.indexOf(orderData.id), 1);
    orders.value.completedOrders.push(orderData.id);
}
const removeOrdersCur = (orderData) => {
    const index = orders.value.curOrders.indexOf(orderData.id);
    if (index !== -1) {
        orders.value.curOrders.splice(index, 1);
    }
}
const removeOrdersCompleted = (orderData) => {
    orders.value.completedOrders.splice(orders.value.completedOrders.indexOf(orderData.id), 1);
}


const removeRTOrdersCur = (orderData) => {
    const index = RTCurOrders.value.indexOf(orderData);
    if (index !== -1) {
        RTCurOrders.value.splice(index, 1);
    }
}
const removeRTOrdersCompleted = (orderData) => {
    RTCompletedOrders.value.splice(RTCompletedOrders.value.indexOf(orderData), 1);
}

const updateRTOrders = (orderData) => {
    RTCurOrders.value.splice(RTCurOrders.value.indexOf(orderData), 1);
    RTCompletedOrders.value.push(orderData);
}




let ably;


onMounted(async () => {
    ably = new Ably.Realtime.Promise("bNcHtg.KWMEIA:ZXfzLmAl8QK42old34hzFlVrTybsHUwViFmXyUISdpg")
    await ably.connection.once('connected');
    console.log('Connected to Ably!');
    const channel = ably.channels.get('orders');
    await channel.subscribe('orders', (message) => {

        RTCurOrders.value.push(message.data)
    });
})


</script>

<template>
    <div class="h-screen w-screen overflow-x-hidden">
        <div class="tabs w-screen flex flex-row mt-4">
            <a @click="tabindex = 0" class='text-xl tab tab-bordered basis-5/6'
                :class="{ 'tab-active': tabindex === 0 }">Orders</a>
            <a @click="tabindex = 1" class="text-xl tab tab-bordered basis-1/6"
                :class="{ 'tab-active': tabindex === 1 }">Menu</a>
        </div>

        <div v-if="tabindex == 0" class="px-16 pt-4">
            <h1 class="text-4xl">Current : {{ orders.curOrders.length }}</h1>
            <div class="flex flex-col gap-2 pt-2">
                <Order v-for="id in orders.curOrders" type="current" :orderID="id" @update="updateOrders"
                    @remove="removeOrdersCur" />
                <Order v-for="order in RTCurOrders" type="current" :orderDatas="order" @update="updateRTOrders(order)"
                    @remove="removeRTOrdersCur" />
            </div>

            <div class="divider"></div>
            <h1 class="text-4xl text-gray-700">Completed: {{ orders.completedOrders.length }}</h1>
            <div class="flex flex-col gap-2 pt-2">
                <Order v-for="id in orders.completedOrders" type="completed" :orderID="id"
                    @remove="removeOrdersCompleted" />
                <Order v-for="order in RTCompletedOrders" type="completed" :orderDatas="order"
                    @update="updateRTOrders(order)" @remove="removeRTOrdersCompleted" />

            </div>
        </div>

        <div v-else class="px-16 pt-4">
            <MenuEditor />
        </div>

    </div>
</template>
