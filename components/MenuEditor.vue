<script setup>
const menu = ref(0)

const CategoryText = ref(null);

//get data from api
const aperitiveData = await fetch("/api/getsection?section=aperitive").then(async res => await res.json());
const mainData = await fetch("/api/getsection?section=main").then(async res => await res.json());
const desertData = await fetch("/api/getsection?section=desert").then(async res => await res.json());
const drinkData = await fetch("/api/getsection?section=drinks").then(async res => await res.json());
const addedItems = ref({});
const addedIds = ref([]);
//populate each category with an ischecked attribute
const data = ref([
    aperitiveData, mainData, desertData, drinkData
])

data.value.forEach(section => {
    section.categories.forEach(category => {
        category.ischecked = false
    })
})

//set category to checked
const setCategory = (section, category, e) => {
    const sectionIndex = data.value.indexOf(section);
    const categoryIndex = data.value[sectionIndex].categories.indexOf(category);
    data.value[sectionIndex].categories[categoryIndex].ischecked = e;
}

const HandleCreateEmit = (itemData) => {
    const sectionIndex = data.value.indexOf(data.value.find(section => section.name.toLocaleLowerCase() == itemData.section));
    const id = itemData.id;
    addedItems.value[id] = itemData;
    addedIds.value.push(itemData.id);
    data.value[sectionIndex].categories[itemData.category].ids.push(itemData.id);
}


const CreateCategory = async (sect) => {

    if (CategoryText.value != null) {
        const sectionIndex = data.value.indexOf(data.value.find(section => section.name.toLocaleLowerCase() == sect));
        data.value[sectionIndex].categories.push({ name: CategoryText.value, ischecked: false, ids: [] });
        const category = CategoryText.value;
        CategoryText.value = null;
        data.value[sectionIndex].ischecked = false;
        await fetch("/api/createcategory?section=" + sect + "&category=" + category);
        return true;
    }
    alert("Please type a name for the category");
}

const deleteMenuItem = (id, section, category) => {
    const sectionIndex = data.value.indexOf(data.value.find(sect => sect.name.toLocaleLowerCase() == section));
    const categoryIndex = category;
    data.value[sectionIndex].categories[categoryIndex].ids.splice(data.value[sectionIndex].categories[categoryIndex].ids.indexOf(id), 1);
    if (addedIds.value.includes(id)) {
        addedIds.value = addedIds.value.filter(i => i != id);
        addedItems.value = Object.keys(addedItems.value).filter(i => i != id).reduce((obj, key) => {
            obj[key] = addedItems.value[key];
            return obj;
        }, {});
    }
}

const deleteCategory = async (section, category) => {
    const sectionIndex = data.value.indexOf(data.value.find(sect => sect.name == section.name));
    const categoryIndex = category;
    //delete all the items fron category
    data.value[sectionIndex].categories[categoryIndex].ids.forEach(id => {
        if (addedIds.value.includes(id)) {
            addedIds.value = addedIds.value.filter(i => i != id);
            addedItems.value = Object.keys(addedItems.value).filter(i => i != id).reduce((obj, key) => {
                obj[key] = addedItems.value[key];
                return obj;
            }, {});
        }
    })
    data.value[sectionIndex].categories.splice(categoryIndex, 1);
    await fetch("/api/deletecategory?section=" + section.name.toLocaleLowerCase() + "&category=" + categoryIndex);
}

//populate each section with an ischecked attribute


</script>

<template>
    <div class="h-max">
        <div v-for="section in data" :key="section.name">
            <div class="flex flex-row items-center">
                <h1 class="text-7xl mb-4 mt-8">{{ section.name }}</h1>
                <div class="flex-1"></div>


                <label :for="section.name" class="btn btn-primary text-xl">New
                    subcategory</label>
                <input type="checkbox" :id="section.name" class="modal-toggle" />
                <label :for="section.name" class="modal cursor-pointer">
                    <label class="modal-box relative" for="">
                        <h3 class="text-lg font-bold">New Category</h3>
                        <input :value="CategoryText" @change="CategoryText = $event.target.value" type="text"
                            placeholder="Type here" class="input w-full mt-2 text-xl bg-base-200" />
                        <div class="w-full flex flex-row mt-2">
                            <label :for="section.name" @click="() => {
                                CategoryText = null;
                            }" class="btn btn-error">Cancel</label>
                            <div class="flex-1"></div>
                            <label :for="section.name" @click="CreateCategory(section.name.toLocaleLowerCase())"
                                class="btn btn-primary">Add</label>
                        </div>
                    </label>
                </label>
            </div>

            <div class="divider"></div>
            <div class="mt-4" v-for="category in section.categories" :key="category.name">
                <div class="flex flex-row items-center mb-4">

                    <h2 class="text-5xl ">{{ category.name }}</h2>
                    <label className="swap ">
                        <input type="checkbox" @change="setCategory(section, category, $event.target.checked)" />
                        <p class="swap-off text-6xl font-thin text-center ml-5">v</p>
                        <p class="swap-on text-6xl font-thin text-center ml-5">{{ ">" }}</p>
                    </label>
                    <div class="flex-1"></div>
                    <button @click="deleteCategory(section, section.categories.indexOf(category))"
                        class="btn btn-error">Delete</button>
                </div>
                <div class=" bg-base-300 p-4 rounded-lg grid grid-flow-row grid-cols-4 gap-3 "
                    :class="{ hidden: category.ischecked }">
                    <CreateItem @create="HandleCreateEmit" :section="section.name.toLocaleLowerCase()"
                        :category="section.categories.indexOf(category)" />
                    <MenuItem @delete="deleteMenuItem" :section="section.name.toLocaleLowerCase()"
                        :category="section.categories.indexOf(category)" v-for="id in category.ids"
                        :itemData="addedIds.includes(id) ? addedItems[id] : undefined" :id="id" />
                </div>
            </div>
        </div>
    </div>
</template>