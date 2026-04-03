<script setup lang="ts">

import { Motion } from "motion-v";
import SleekLineCursor from "../ui/sleek-line-cursor/SleekLineCursor.vue";
import WavyBackground from "../ui/wavy-background/WavyBackground.vue";
import BrainMockup from "./brainMockup.vue";
</script>

<template>
     <wavy-background class="mx-auto w-full pb-2   0">
     <ClientOnly>
      <SleekLineCursor />
    </ClientOnly>
    <div class="flex flex-col lg:flex-row items-center w-full h-full!"> 
      <div class="flex w-full items-center h-[50%] lg:h-auto lg:w-[50%]!">
        <div class="w-full">
          <Motion
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
          >
          <p class="inter-var text-center text-2xl font-bold text-white md:text-4xl lg:text-7xl">
            Concovery
          </p>
          </Motion>
          <p class="inter-var mt-4 text-center text-base font-normal text-white md:text-lg">
            Concussion Brain Health Education
          </p>
        </div>
      </div>
      <div class="w-full lg:w-[50%]! h-[50%]! lg:h-auto!">
        <BrainMockup/>
      </div>
    </div>
  </wavy-background> 
</template>

<style scoped></style>