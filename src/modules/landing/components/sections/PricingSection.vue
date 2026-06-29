<template>
  <section id="pricing" class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="landing-feature-chip mb-4 inline-flex items-center gap-1.5">
          <CreditCard class="w-3.5 h-3.5" /> {{ t('landing.pricing.badge') }}
        </span>
        <h2 class="landing-section-title mb-4">{{ t('landing.pricing.title') }}</h2>
        <p class="landing-section-subtitle max-w-2xl mx-auto">{{ t('landing.pricing.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        <!-- Trial Card -->
        <div class="flex flex-col p-8 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl shadow-amber-500/30 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="relative z-10 flex flex-col h-full">
            <div class="mb-6">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                <Gift class="w-3.5 h-3.5" /> {{ locale === 'kh' ? '៣-៦ ខែ' : '3–6 Months Free' }}
              </span>
              <h3 class="font-black text-2xl">{{ locale === 'kh' ? 'ជំនាន់សាកល្បង' : 'Trial' }}</h3>
              <p class="text-amber-100 text-sm mt-1">{{ locale === 'kh' ? 'ប្រើ Pro ដោយឥតគិតថ្លៃ' : 'Full Pro access, free' }}</p>
            </div>
            <div class="mb-6">
              <span class="text-5xl font-black">$0</span>
              <span class="text-amber-200 text-sm">/{{ locale === 'kh' ? 'ខែ' : 'month' }}</span>
            </div>
            <ul class="space-y-2.5 flex-1 mb-8">
              <li v-for="feat in trialFeatures" :key="feat.en" class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">{{ locale === 'kh' ? feat.km : feat.en }}</span>
              </li>
            </ul>
            <a href="#download" class="landing-btn-white w-full text-center text-orange-600">{{ locale === 'kh' ? 'ចាប់ផ្តើម' : 'Get Started' }}</a>
          </div>
        </div>

        <!-- Pro Card -->
        <div class="flex flex-col p-8 rounded-3xl bg-gradient-to-br from-landing-primary-600 to-indigo-700 text-white shadow-2xl shadow-landing-primary-600/40 relative overflow-hidden scale-105 z-10">
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="relative z-10 flex flex-col h-full">
            <div class="mb-6">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                <Star class="w-3.5 h-3.5" /> {{ locale === 'kh' ? 'ពេញនិយម' : 'Most Popular' }}
              </span>
              <h3 class="font-black text-2xl">Pro</h3>
              <p class="text-landing-primary-200 text-sm mt-1">{{ locale === 'kh' ? 'មុខងារទាំងអស់' : 'All features unlocked' }}</p>
            </div>
            <div class="mb-6">
              <span class="text-5xl font-black">$10</span>
              <span class="text-landing-primary-300 text-sm">/{{ locale === 'kh' ? 'ខែ' : 'month' }}</span>
            </div>
            <ul class="space-y-2.5 flex-1 mb-8">
              <li v-for="feat in proFeatures" :key="feat.en" class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">{{ locale === 'kh' ? feat.km : feat.en }}</span>
              </li>
            </ul>
            <a href="#download" class="landing-btn-white w-full text-center text-landing-primary-700">{{ locale === 'kh' ? 'ទទួល Pro' : 'Get Pro' }}</a>
          </div>
        </div>

        <!-- Free Card -->
        <div class="flex flex-col p-8 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm relative">
          <div class="flex flex-col h-full">
            <div class="mb-6">
              <span class="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold mb-3">{{ locale === 'kh' ? 'គម្រងមូលដ្ឋាន' : 'Basic Plan' }}</span>
              <h3 class="font-black text-2xl text-gray-900 dark:text-white">{{ locale === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free' }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ locale === 'kh' ? 'មុខងារកំណត់' : 'Limited features' }}</p>
            </div>
            <div class="mb-6">
              <span class="text-5xl font-black text-gray-900 dark:text-white">$0</span>
              <span class="text-gray-400 text-sm">/{{ locale === 'kh' ? 'ខែ' : 'month' }}</span>
            </div>
            <ul class="space-y-2.5 flex-1 mb-8">
              <li v-for="feat in freeFeatures" :key="feat.en" class="flex items-start gap-2.5">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0"
                  :class="feat.available ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="feat.available" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm" :class="feat.available ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through'">
                  {{ locale === 'kh' ? feat.km : feat.en }}
                </span>
              </li>
            </ul>
            <a href="#download" class="landing-btn-outline w-full text-center">{{ locale === 'kh' ? 'ចាប់ផ្តើម' : 'Get Started' }}</a>
          </div>
        </div>

      </div>

      <!-- Note -->
      <p class="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
        <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        {{ locale === 'kh'
          ? 'ម្ចាស់ថ្មីអាចប្រើ Trial ឥតគិតថ្លៃ ៣ ខែ — មិនត្រូវការប័ណ្ណឥណទាន'
          : 'New owners get Trial (full Pro) free for 3 months — no credit card required'
        }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CreditCard, Gift, Star } from 'lucide-vue-next'
const { t, locale } = useI18n()

const trialFeatures = [
  { en: 'Create fuel types',           km: 'បង្កើតប្រភេទឥន្ធនៈ' },
  { en: 'Create sales records',        km: 'កំណត់ការលក់' },
  { en: 'Create stock income records', km: 'ស្តុកចូល' },
  { en: 'View all reports',            km: 'មើលរបាយការណ៍ទាំងអស់' },
  { en: 'View Current Stock of Fuel',  km: 'មើលស្តុកឥន្ធនៈបច្ចុប្បន្ន' },
  { en: 'Create & manage staff',       km: 'បង្កើត & គ្រប់គ្រងបុគ្គលិក' },
  { en: 'Export Excel',                km: 'ទាញ Excel' },
]

const proFeatures = [
  { en: 'Create fuel types',           km: 'បង្កើតប្រភេទឥន្ធនៈ' },
  { en: 'Create sales records',        km: 'កំណត់ការលក់' },
  { en: 'Create stock income records', km: 'ស្តុកចូល' },
  { en: 'View all reports',            km: 'មើលរបាយការណ៍ទាំងអស់' },
  { en: 'View Current Stock of Fuel',  km: 'មើលស្តុកឥន្ធនៈបច្ចុប្បន្ន' },
  { en: 'Create & manage staff',       km: 'បង្កើត & គ្រប់គ្រងបុគ្គលិក' },
  { en: 'Export Excel',                km: 'ទាញ Excel' },
]

const freeFeatures = [
  { available: true,  en: 'Create fuel types',           km: 'បង្កើតប្រភេទឥន្ធនៈ' },
  { available: true,  en: 'Create sales records',        km: 'កំណត់ការលក់' },
  { available: true,  en: 'Create stock income records', km: 'ស្តុកចូល' },
  { available: true,  en: 'View all reports',            km: 'មើលរបាយការណ៍ទាំងអស់' },
  { available: true,  en: 'View Current Stock of Fuel',  km: 'មើលស្តុកឥន្ធនៈបច្ចុប្បន្ន' },
  { available: false, en: 'Existing staff access suspended', km: 'បុគ្គលិកដែលមានស្ថានភាពផ្អាក' },
  { available: false, en: 'Create & manage staff',       km: 'បង្កើត & គ្រប់គ្រងបុគ្គលិក' },
  { available: false, en: 'Export Excel',                km: 'ទាញ Excel' },
]
</script>
