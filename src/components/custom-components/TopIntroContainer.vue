<script setup>
import BlurReveal from '../ui/blur-reveal/BlurReveal.vue';

</script>

<template>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden"
        style="background: rgb(10, 10, 15);">
        <div class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(60% 40%, rgba(0, 122, 255, 0.06) 0%, transparent 70%);"></div>
        <div class="hidden lg:block absolute left-0 bottom-0 w-[310px]"
            style="z-index: 1; opacity: 1; transform: none;"><canvas width="310" height="520" class="w-full h-auto"
                data-fg-dag0="33.111:140.65916:/src/app/pages/Home.tsx:367:5:8371:125:e:canvas::1"
                style="max-width: 310px;"></canvas></div>
        <div class="hidden lg:block absolute right-0 bottom-0 w-[310px]"
            style="z-index: 1; opacity: 1; transform: none;"><canvas width="310" height="520" class="w-full h-auto"
                data-fg-dag0="33.111:140.65916:/src/app/pages/Home.tsx:367:5:8371:125:e:canvas::1"
                style="max-width: 310px;"></canvas></div>
        <div class="relative text-center px-4 sm:px-8 max-w-4xl mx-auto py-24" style="z-index: 2;">
            <div class="inline-flex items-center gap-2 border text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
                style="color: rgba(255, 255, 255, 0.45); border-color: rgba(255, 255, 255, 0.1); opacity: 1; transform: none;">
                <span class="w-1.5 h-1.5 rounded-full" style="background: rgb(0, 122, 255);"></span>Australian community
                sport
            </div>
            <BlurReveal :delay="0.2" :duration="0.75">
                 <h1 class="font-black tracking-tight leading-none mb-8 text-white"
                style="font-size: clamp(64px, 12vw, 160px); letter-spacing: -0.03em; opacity: 1; transform: none;">
                CONCOVERY</h1>
            <p class="text-lg sm:text-xl font-light mb-10 tracking-wide"
                style="color: rgba(255, 255, 255, 0.45); opacity: 1; transform: none;">Play
                hard. Recover smart. Come back stronger.</p>
            </BlurReveal>
           
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center"
                style="opacity: 1; transform: none;">
                <router-link to="/exploredata"><button
                        class="relative bg-[#007aff] text-white px-9 py-4 text-base rounded-full font-semibold flex items-center gap-2 overflow-hidden shadow-2xl shadow-[#007aff]/30"
                        style="transform: none;">
                        <div class="absolute inset-0 -skew-x-12"
                            style="background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent); transform: translateX(215.748%);">
                        </div>Check My Sport's Risk
                    </button></router-link>
                <router-link to="/locatesupport"><button
                        class="border border-white/20 text-white/70 hover:border-white/40 hover:text-white px-9 py-4 text-base rounded-full font-semibold flex items-center gap-2 transition-all duration-300">
                    Find Immediate Support</button></router-link>
            </div>
        </div>
        <div class="absolute bottom-8 flex flex-col items-center gap-1.5"
            data-fg-dag47="33.111:140.65916:/src/app/pages/Home.tsx:587:9:15651:499:e:motion.div:e"
            data-fgid-dag47=":r1a:" style="color: rgba(255, 255, 255, 0.2); z-index: 2; opacity: 1;">
            <div data-fg-dag48="33.111:140.65916:/src/app/pages/Home.tsx:594:11:15943:185:e:motion.div:e"
                data-fgid-dag48=":r1b:" style="transform: translateY(4.69582px);"><svg
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chevron-down">
                    <path d="m6 9 6 6 6-6"></path>
                </svg></div>
        </div>
    </section>
</template>

<style scoped></style>