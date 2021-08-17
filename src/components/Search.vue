<template>
    <div class="app-map__search">
        <form @submit="(e) => submit(e)">
            <input type="text" v-model="postcode" placeholder="Postcode search" :class="{'is-error': errors.value}">
            <input type="submit" value="Go">
        </form>
        <div class="app-map__search-error" v-if="errors.value">{{ errors.message }}</div>
    </div>
</template>


<script>

import { mapGetters } from "vuex"

export default {
    name: 'Search',
    data() {
        return {
            postcode: '',
            errors: {
                message: "Not found",
                value: false
            },
            search: "japanese knotweed",
            pageSize: 10000,
            radius: 15 //km
            
        }
    },
    computed: {
        ...mapGetters([
            'location'
        ])
    },
    methods: {
        submit(e) {
            e.preventDefault()
            this.searchPostcode()
        },
        searchPostcode() {
            const api = `https://api.postcodes.io/postcodes/${this.postcode}`
            console.log(api)
            this.$http.get(api).then((response) => {
                this.$store.commit('location', response.data.result)
                this.errors.value = false
                this.searchList()
            }).catch(() => {
                this.errors.value = true
            })
        },
        searchList() {
            const api = `https://records-ws.nbnatlas.org/occurrences/search?q=${this.search}&pageSize=${this.pageSize}&lon=${this.location.longitude}&lat=${this.location.latitude}&radius=${this.radius}`
            this.$http.get(api).then((response) => {
                console.log(response.data.occurrences)
                this.$store.commit('occurrences', response.data.occurrences)
            })
        }
    }
}
</script>