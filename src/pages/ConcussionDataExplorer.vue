<script setup>
</script>

<template>
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
        data-fg-dqrj1="33.110:33.18481:/src/app/pages/Data.tsx:109:7:3530:14934:e:div:xtetxtetxtetxtetxte"
        data-fgid-dqrj1=":r17r:">
        <div class="text-center mb-16"
            data-fg-dqrj3="33.110:33.18481:/src/app/pages/Data.tsx:111:9:3629:559:e:motion.div:ete"
            data-fgid-dqrj3=":r17s:" style="opacity: 1; transform: none;">
            <h1 class="text-5xl sm:text-7xl font-semibold text-[#1d1d1f] mb-6 tracking-tight"
                data-fg-dqrj4="33.110:33.18481:/src/app/pages/Data.tsx:116:11:3785:139:e:h1:t" data-fgid-dqrj4=":r17t:">
                Concussion Data Explorer</h1>
            <p class="text-xl sm:text-2xl text-[#86868b] max-w-3xl mx-auto"
                data-fg-dqrj6="33.110:33.18481:/src/app/pages/Data.tsx:119:11:3935:231:e:p:t" data-fgid-dqrj6=":r17u:">
                Real injury data from Australian community sport. Understand the scale and trends of concussion across
                different sports and age groups.</p>
        </div>
        <!-- Dropdown Menus -->
        <div class="bg-[#f5f5f7] rounded-3xl p-8 mb-12 shadow-lg" style="opacity: 1; transform: none;">
            <div class="flex items-center gap-3 mb-6">
                <div class="bg-[#007aff] rounded-2xl p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-funnel text-white">
                        <path
                            d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z">
                        </path>
                    </svg>
                </div>
                <h2 class="text-2xl font-semibold text-[#1d1d1f]">Filter Data</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Sports Dropdown -->
                <div>
                    <label class="block text-[#1d1d1f] font-semibold mb-3 text-sm uppercase tracking-wide">Select Sport</label>
                        <select
                        class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg font-medium focus:outline-none focus:border-[#007aff] transition-colors">
                            <option value="AFL">AFL</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Rugby Union">Rugby Union</option>
                            <option value="Rugby League">Rugby League</option>
                            <option value="Netball">Netball</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Cycling">Cycling</option>
                            <option value="Horse Riding">Horse Riding</option>
                        </select>
                </div>
                <!-- Agegroup Dropdown -->
                <div>
                    <label
                        class="block text-[#1d1d1f] font-semibold mb-3 text-sm uppercase tracking-wide">Select Age Group</label>
                        <select
                        class="w-full bg-white border-2 border-[#d2d2d7] rounded-2xl px-6 py-4 text-[#1d1d1f] text-lg font-medium focus:outline-none focus:border-[#007aff] transition-colors">
                        <option value="5-9">5-9 years</option>
                        <option value="10-14">10-14 years</option>
                        <option value="15-19">15-19 years</option>
                        <option value="20-24">20-24 years</option>
                        <option value="25-29">25-29 years</option>
                        <option value="30+">30+ years</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- Bar Chart Section -->
        <div class="bg-white rounded-3xl p-10 mb-12 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50" style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3">Concussion Hospitalisations by Age Group</h3>
                    <p class="text-[#86868b] text-lg">AFL 15-19 years highlighted</p>
                </div>
            </div>
            <!-- Bar Chart Section -->
            <div class="h-80 mb-8 flex items-center justify-center font-bold">
                <h2>Bar Chart Will Be Displayed Here</h2>
            </div>
            <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-6 border border-[#007aff]/30">
                <p class="text-[#1d1d1f] text-lg leading-relaxed"><strong>Key Insight: </strong>Insight from database will be displayed here</p>
            </div>
            <p class="text-[#86868b] text-sm mt-4"
                data-fg-dqrj67="33.110:33.18481:/src/app/pages/Data.tsx:233:11:9016:164:e:p:t"
                data-fgid-dqrj67=":r194:">Source: Australian Institute of Health and Welfare (AIHW), Sports Injury in
                Australia 2023-24</p>
        </div>
        <!-- Line Chart Section -->
        <div class="bg-white rounded-3xl p-10 mb-12 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50" style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trending-up text-[#007aff]"
                            data-fg-dqrj74="33.110:33.18481:/src/app/pages/Data.tsx:248:17:9716:67:e:TrendingUp::::::tM8"
                            data-fgid-dqrj74=":r199:">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                        10-Year Trend Analysis
                    </h3>
                    <p class="text-[#86868b] text-lg">Concussion hospitalisation rates 2014-15 to 2023-24</p>
                </div>
                <div class="flex gap-3">
                    <button
                        class="px-6 py-3 rounded-full font-semibold transition-all bg-[#007aff] text-white shadow-lg shadow-blue-500/25">Male</button>
                        <button
                        class="px-6 py-3 rounded-full font-semibold transition-all bg-[#ff2d55] text-white shadow-lg shadow-pink-500/25">Female</button>
                </div>
            </div>
            <div class="h-96 mb-8 flex items-center justify-center font-bold">
                <h2>Line Chart will be displayed here</h2>
            </div>
            <div class="space-y-4">
                <div class="bg-[#ff9500]/10 rounded-2xl p-6 border border-[#ff9500]/30">
                    <div class="flex items-start gap-3"
                        data-fg-dqrj97="33.110:33.18481:/src/app/pages/Data.tsx:332:15:12881:556:e:div:ete"
                        data-fgid-dqrj97=":r19i:">
                        <div class="bg-[#ff9500] rounded-lg p-2 flex-shrink-0"></div>
                        <div>
                            <p class="text-[#1d1d1f] font-semibold mb-1">Some Key Information From Line Graph</p>
                            <p class="text-[#1d1d1f]">Some Description</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-[#34c759]/10 to-[#34c759]/5 rounded-2xl p-6 border border-[#34c759]/30">
                    <div class="flex items-start gap-3">
                        <div class="bg-[#34c759] rounded-lg p-2 flex-shrink-0"></div>
                        <div>
                            <p class="text-[#1d1d1f] font-semibold mb-1">Something Important</p>
                            <p class="text-[#1d1d1f]">Some description</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-6 border border-[#007aff]/30">
                    <p class="text-[#1d1d1f] text-lg leading-relaxed">
                        <strong class="text-[#007aff]">Key Finding:</strong> Something crucial here as well</p>
                </div>
            </div>
            <p class="text-[#86868b] text-sm mt-4">Source: Australian Institute of Health and Welfare (AIHW), Sports Injury in
                Australia 2014-24</p>
        </div>
        <!-- Comparison Graph -->
        <div class="bg-white rounded-3xl p-10 shadow-2xl shadow-black/5 border border-[#d2d2d7]/50" style="opacity: 1; transform: none;">
            <div class="flex items-start justify-between mb-8">
                <div>
                    <h3 class="text-3xl font-semibold text-[#1d1d1f] mb-3 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users text-[#007aff]"
                            data-fg-dqrj132="33.110:33.18481:/src/app/pages/Data.tsx:382:17:15442:62:e:Users::::::DV8M"
                            data-fgid-dqrj132=":r1a8:">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>Sport Comparison
                    </h3>
                    <p class="text-[#86868b] text-lg">Concussion rate per 100,000 participants AFL highlighted</p>
                </div>
            </div>
            <div class="h-96 mb-8">
                <div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0px;">
                    <div class="flex items-center justify-center font-bold w-full h-full">
                        <h3>Comparison graph goes here</h3>
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                <div class="bg-gradient-to-br from-[#007aff]/10 to-[#5ac8fa]/10 rounded-2xl p-6 border border-[#007aff]/30">
                    <p class="text-[#1d1d1f] text-lg leading-relaxed"><strong class="text-[#007aff]"
                            data-fg-dqrj151="33.110:33.18481:/src/app/pages/Data.tsx:432:17:17460:73:e:strong:t"
                            data-fgid-dqrj151=":r1af:">Why this?</strong> because</p>
                </div>
                <div class="bg-[#f5f5f7] rounded-2xl p-6">
                    <p class="text-[#1d1d1f] text-lg leading-relaxed"><strong>Contact sports dominate:</strong> AFL, Rugby Union, and Rugby
                        League have the highest concussion rates per participant. However, all sports carry some
                        concussion risk - from cycling falls to collisions in basketball.</p>
                </div>
            </div>
            <p class="text-[#86868b] text-sm mt-4"
                data-fg-dqrj159="33.110:33.18481:/src/app/pages/Data.tsx:443:11:18274:155:e:p:t"
                data-fgid-dqrj159=":r1aj:">Source: AIHW Sports Injury in Australia 2023-24 AusPlay Participation Data
                2024-25</p>
        </div>
    </div>

</template>

<style scoped></style>