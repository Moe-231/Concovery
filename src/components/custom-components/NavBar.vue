<script setup>
import { User } from '@lucide/vue';

</script>

<template>
    <div class="p-4 border-b-2 shadow-xl">
        <div class="flex justify-between items-center">
            <div>
                <router-link to="/" class="text-2xl font-bold">
                    Concovery
                </router-link>
            </div>
            <div>
                <User :size="48" color="black" :stroke-width="2" />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>