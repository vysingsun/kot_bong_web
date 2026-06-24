<template>
  <footer class="bg-gray-950 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 flex items-center justify-center rounded-xl bg-white">
              <svg aria-hidden="true" fill="blue" viewBox="0 0 20 20" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="font-bold text-lg text-white">Kot Preng</span>
          </div>
          <p class="text-sm leading-relaxed max-w-xs">{{ t('landing.footer.tagline') }}</p>
          <div class="flex items-center gap-3 mt-6">
            <a href="/home" class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-landing-primary-600 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.005 2H8.034c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/></svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">{{ t('landing.footer.links') }}</h4>
          <ul class="space-y-3">
            <li><a href="#features" class="text-sm hover:text-landing-primary-400 transition-colors">{{ t('landing.nav.features') }}</a></li>
            <li><a href="#how-it-works" class="text-sm hover:text-landing-primary-400 transition-colors">{{ t('landing.nav.howItWorks') }}</a></li>
            <li><a href="#pricing" class="text-sm hover:text-landing-primary-400 transition-colors">{{ t('landing.nav.pricing') }}</a></li>
            <li><router-link to="/policy" class="text-sm hover:text-landing-primary-400 transition-colors">{{ t('landing.nav.policy') }}</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">{{ t('landing.footer.contact') }}</h4>
          <ul class="space-y-3">
            <li>
              <div class="text-sm hover:text-landing-primary-400 transition-colors flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail class="w-3.5 h-3.5 text-gray-400" />
                </div>
                kotpreng@gmail.com
              </div>
            </li>
            <li>
              <a class="text-sm hover:text-landing-primary-400 transition-colors flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone class="w-3.5 h-3.5 text-gray-400" />
                </div>
                015674774
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-500">{{ t('landing.footer.rights') }}</p>
        <div class="flex items-center gap-4">
          <router-link to="/policy" class="text-xs text-gray-500 hover:text-landing-primary-400 transition-colors">{{ t('landing.policy.privacy') }}</router-link>
          <span class="text-gray-700">·</span>
          <router-link to="/policy" class="text-xs text-gray-500 hover:text-landing-primary-400 transition-colors">{{ t('landing.policy.terms') }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail, Phone } from 'lucide-vue-next'
const { t } = useI18n()
</script>
