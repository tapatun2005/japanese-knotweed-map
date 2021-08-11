<template>
    <div class="filters">
        <div>{{ filters }}</div>
        <div>
            <button v-for="(item, index) in list" :key="index" @click="setFilter(item)">
                {{ item }}
            </button>
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
                'unconfirmed',
                'accepted'
            ],
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
        }
    }
}
</script>