<script setup>
</script>

<template>
    <div>
        <div class="mb-12" style="opacity: 1; transform: none;">
            <div class="bg-[#f5f5f7] rounded-3xl p-8 shadow-xl">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-semibold text-[#1d1d1f]">Recovery Stages</h2>
                </div>
                <!-- Stages Button Section -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <button
                        class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 1</div>
                                <div class="text-xs font-semibold">Rest</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Your brain cells are in metabolic crisis</p>
                        </div>
                    </button>
                    <button class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 2</div>
                                <div class="text-xs font-semibold">Light Activity</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Cellular inflammation is high, but stabilizing
                            </p>
                        </div>
                    </button>
                    <button
                        class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 3</div>
                                <div class="text-xs font-semibold">Moderate</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Axons are beginning to regenerate connections
                            </p>
                        </div>
                    </button>
                    <button class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 4</div>
                                <div class="text-xs font-semibold">Heavy Activity</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Energy metabolism is recovering but not
                                baseline</p>
                        </div>
                    </button>
                    <button class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 5</div>
                                <div class="text-xs font-semibold">Full Training</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Cellular architecture is stabilizing</p>
                        </div>
                    </button>
                    <button
                        class="relative group rounded-2xl p-6 border-2 transition-all bg-white border-[#007aff] text-[#007aff] hover:shadow-xl hover:scale-105 cursor-pointer">
                        <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <div class="text-center">
                                <div class="font-bold text-sm mb-1">Stage 6</div>
                                <div class="text-xs font-semibold">Return</div>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-current/20">
                            <p class="text-xs leading-relaxed opacity-80">Brain fully recovered with restored reserves
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="bg-[#f5f5f7] rounded-3xl p-16 text-center" style="opacity: 1; transform: none;">
            <div class="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-activity text-[#007aff]">
                    <path
                        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2">
                    </path>
                </svg>
            </div>
            <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3">Select your current recovery stage</h3>
            <p class="text-[#86868b] text-lg">Click on any stage above to see detailed guidance, activities, and brain
                science
            </p>
        </div>
        <div class="mt-12 bg-white rounded-2xl p-6 border border-[#d2d2d7]/50" style="opacity: 1;">
            <div class="flex items-start gap-3">
                <div class="bg-[#ff9500]/10 rounded-xl p-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-triangle-alert text-[#ff9500]">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-[#86868b] text-sm"><strong class="text-[#1d1d1f]">Important Disclaimer:</strong> No
                        data is stored between sessions. This tool is for education only and does not replace medical
                        advice. Always progress through stages under medical supervision. If symptoms return at any
                        stage, stop immediately and return to the previous stage.</p>
                </div>
            </div>
        </div>
        <div class="mt-6 text-center">
            <p class="text-[#86868b] text-sm">All content sourced from <strong class="text-[#1d1d1f]">Australian
                    Institute of Sport (AIS) Concussion and Brain Health Position Statement 2024</strong></p>
        </div>
    </div>

</template>

<style scoped></style>