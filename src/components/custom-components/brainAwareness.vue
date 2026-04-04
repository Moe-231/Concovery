<script setup lang="ts">

import SleekLineCursor from "../ui/sleek-line-cursor/SleekLineCursor.vue";
import BrainMockup from "./brainMockup.vue";
import BlurReveal from "../ui/blur-reveal/BlurReveal.vue";
import InteractiveFocusContent from "./InteractiveFocusContent.vue";
import CustomGrid from "./CustomGrid.vue";


</script>

<template>
     <ClientOnly>
      <SleekLineCursor />
    </ClientOnly>
    <div class="flex flex-col lg:flex-row items-center w-full h-full! border-black border-b-2"> 
      <div class="flex w-full items-center h-[50%] lg:h-auto lg:w-[50%]!">
        <div class="w-full">
          <!-- <Motion
            as="div"
            :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
            :while-in-view="{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }"
            :transition="{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }"
            class="relative flex flex-col items-center justify-center gap-4 px-4"
          > -->
          <BlurReveal
      :delay="0.2"
      :duration="0.75"
      class="p-8"
    >
          <p class="inter-var text-center text-2xl text-black md:text-4xl lg:text-7xl">
            <span class="text-white [-webkit-text-stroke:2px_black]! tracking-tighter">Con</span>cussion
          </p>
          <p class="inter-var text-center text-2xl text-black md:text-4xl lg:text-7xl tracking-tighter">Re<span class="text-white [-webkit-text-stroke:2px_black]!">covery</span></p>
          </BlurReveal>
          <!-- </Motion> -->
          <p class="inter-var mt-4 text-center text-base font-normal text-black md:text-lg">
            Your path to better brain health
          </p>
        </div>
      </div>
      <div class="w-full lg:w-[50%]! h-[50%]! lg:h-auto! p-2">
        <BrainMockup/>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row space-y-5 items-center justify-around p-15">
      <InteractiveFocusContent/>
      <CustomGrid textGlowStartColor="#fff"
      textGlowEndColor="#000"
      :perspective="1000"
      :rotateX="0"
      :rotateY="0"/>
    </div>
</template>

<style scoped></style>