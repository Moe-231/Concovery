<script setup lang="ts">
import BrainMockup from "./brainMockup.vue";
import BlurReveal from "../ui/blur-reveal/BlurReveal.vue";
import TopLevelStatistics from "./TopLevelStatistics.vue";
import InformativeStatSection from "./InformativeStatSection.vue";


</script>

<template>
  <div class="flex flex-col lg:flex-row items-center w-full h-full! border-black border-b-2">
    <div class="flex w-full items-center h-[50%] lg:h-auto lg:w-[50%]!">
      <div class="w-full">
        <BlurReveal :delay="0.2" :duration="0.75" class="p-8 flex flex-col items-start">
          <p class="inter-var text-center text-2xl text-black font-bold md:text-4xl lg:text-7xl">
            You felt fine
          </p>
          <p class="relative w-fit inter-var text-center text-2xl text-[#007aff] font-bold md:text-4xl lg:text-7xl">
            on day 7.
            <span class="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
              style="background: linear-gradient(90deg, transparent, rgb(0, 122, 255), transparent); transform: none;"></span>
          </p>
          <p class="inter-var text-center text-2xl text-black md:text-4xl lg:text-7xl tracking-tighter">Your brain
            wasn't</p>
        </BlurReveal>
        <!-- </Motion> -->
        <p class="pl-8 text-xl sm:text-2xl text-[#86868b] mb-12 leading-relaxed max-w-xl font-light"
          style="opacity: 1; transform: none;">The first Australian tool bringing concussion neuroscience and real
          injury data to community sport players - in a language they can actually understand.</p>
      </div>
    </div>
    <div class="w-full lg:w-[50%]! h-[50%]! lg:h-auto! p-2">
      <!-- <VisualisedBrainRegions/> -->
      <BrainMockup />
    </div>
  </div>
  <div class="pt-28 pb-28">
    <TopLevelStatistics/>
  </div>
  <div>
    <InformativeStatSection/>
  </div>
</template>

<style scoped></style>