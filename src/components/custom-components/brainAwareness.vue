<script setup lang="ts">
import BrainMockup from "./brainMockup.vue";
import BlurReveal from "../ui/blur-reveal/BlurReveal.vue";
import TopLevelStatistics from "./TopLevelStatistics.vue";
import InformativeStatSection from "./InformativeStatSection.vue";
import TopIntroContainer from "./TopIntroContainer.vue";
import BorderBeam from "../ui/border-beam/BorderBeam.vue";


</script>

<template>
  <TopIntroContainer />
  <div class="pt-28 pb-28">
    <TopLevelStatistics />
  </div>
  <div>
    <InformativeStatSection />
  </div>
  <div class="flex flex-col gap-y-8 p-8 lg:p-25">
    <div class="flex items-center justify-center">
      <ClientOnly>
        <div class="relative flex h-auto p-2 w-full flex-col items-center justify-center overflow-hidden rounded-lg ">
          <span
            class="pointer-events-none  text-center text-2xl leading-none font-semibold whitespace-pre-wrap text-black">
            The Brain-Symptom Connection
          </span>
          <BorderBeam :size="50" :duration="11" :delay="8" :border-width="2" />
        </div>
      </ClientOnly>
    </div>
    <BrainMockup />
  </div>
</template>

<style scoped></style>