<template>
    <div :class="{ 'app-map__filters': true, 'is-open': isOpen }">
        <div class="_title" @click="toggle">{{ filters }} cases</div>
        <div class="_dropdown">
            <div v-for="(item, index) in list" :key="index" @click="setFilter(item)" class="_button">
                {{ item }}
            </div>
        </div>
    </div>
</template>


<script>

import { mapGetters } from "vuex"

export default {
    name: 'Filters',
    data() {
        return {
            list: [
                'all',
                'resolved',
                'live'
            ],
            isOpen: false
        }
    },
    computed: {
        ...mapGetters([
            'filters'
        ]),

    },
    methods: {
        setFilter(name) {
            console.log(name)
            this.$store.commit('filters', name)
            this.isOpen = false
        },
        toggle() {
            this.isOpen = !this.isOpen
        }
    }
}
</script>