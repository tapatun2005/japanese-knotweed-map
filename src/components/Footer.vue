<template>
    <div class="app-map__footer">
        Live data from the NBN Atlas API. Location data is only accurate to within 1km of reported case. {{ year }}
    </div>
</template>

<script>
    export default {
        name: 'Footer',
        data () {
            return {
                year: new Date().getFullYear()
            }
        }
    }
</script>