<script setup lang="ts">
import BrainAwareness from './components/custom-components/brainAwareness.vue';
import NavBar from './components/custom-components/NavBar.vue';
import SmoothCursor from './components/ui/smooth-cursor/SmoothCursor.vue';



</script>
<template>
 <NavBar/> 
 <div class="flex items-center justify-center text-xl">
    <SmoothCursor/>
 </div>
 <router-view/>
</template>

<style scoped></style>
