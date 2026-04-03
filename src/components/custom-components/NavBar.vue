<script setup>
import { User } from '@lucide/vue';

</script>

<template>
    <div class="p-4">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold">
                    Concovery
                </h2>


            </div>
            <div>
                <User :size="48" color="black" :stroke-width="2" />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>