<template>
  <section class="py-24 bg-white dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="landing-feature-chip mb-4 inline-flex items-center gap-1.5">
          <Users class="w-3.5 h-3.5" /> {{ t('landing.roles.badge') }}
        </span>
        <h2 class="landing-section-title mb-4">{{ t('landing.roles.title') }}</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Owner Card -->
        <div class="relative rounded-3xl bg-gradient-to-br from-landing-primary-600 to-indigo-700 text-white overflow-hidden shadow-2xl shadow-landing-primary-600/30">
          <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div class="relative z-10 p-8">
            <div class="flex items-start gap-4 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="font-bold text-2xl leading-tight">{{ locale === 'kh' ? 'ម្ចាស់ (Owner)' : 'Owner' }}</h3>
                <p class="text-landing-primary-200 text-sm mt-1 leading-relaxed">
                  {{ locale === 'kh'
                    ? 'ម្ចាស់គណនីចម្បង ដែលមានការគ្រប់គ្រង ពេញលេញទាំងការគ្រប់គ្រង និងប្រតិបត្តិការ'
                    : 'The Owner is the primary account holder with full administrative and operational control.'
                  }}
                </p>
              </div>
            </div>

            <ul class="space-y-2.5">
              <li v-for="feat in ownerFeatures" :key="feat.en" class="flex items-start gap-2.5">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" :class="feat.can ? 'text-landing-green-400' : 'text-red-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="feat.can" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm leading-relaxed" :class="feat.can ? 'text-white' : 'text-white/60'">
                  {{ locale === 'kh' ? feat.km : feat.en }}
                  <span v-if="feat.pro" class="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">Pro</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Staff Card -->
        <div class="relative rounded-3xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="absolute top-0 right-0 w-48 h-48 bg-landing-primary-50 dark:bg-landing-primary-900/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div class="relative z-10 p-8">
            <div class="flex items-start gap-4 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-landing-primary-100 dark:bg-landing-primary-900/30 flex items-center justify-center flex-shrink-0">
                <User class="w-7 h-7 text-landing-primary-600 dark:text-landing-primary-400" />
              </div>
              <div>
                <h3 class="font-bold text-2xl text-gray-900 dark:text-white leading-tight">{{ locale === 'kh' ? 'បុគ្គលិក (Staff)' : 'Staff' }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                  {{ locale === 'kh'
                    ? 'គណនីបុគ្គលិកបង្កើតដោយម្ចាស់។ ការលក់ម្នាក់ៗត្រូវវន្តជាប់ជាមួយ បុគ្គលិកម្នាក់ ដើម្បីតាមដានការលក់ម្នាក់ៗ'
                    : 'Staff accounts are created by the Owner. Each sales record is attributed to the staff member who created it, enabling per-person sales tracking.'
                  }}
                </p>
              </div>
            </div>

            <ul class="space-y-2.5">
              <li v-for="feat in staffFeatures" :key="feat.en" class="flex items-start gap-2.5">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" :class="feat.can ? 'text-landing-primary-500' : 'text-gray-300 dark:text-gray-600'" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="feat.can" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm leading-relaxed" :class="feat.can ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through'">
                  {{ locale === 'kh' ? feat.km : feat.en }}
                </span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Users, Crown, User } from 'lucide-vue-next'
const { locale, t } = useI18n()

const ownerFeatures = [
  { can: true,  pro: false, en: 'Register and manage the gas station account',              km: 'ចុះឈ្មោះ និងគ្រប់គ្រងគណនីស្ថានីយ' },
  { can: true,  pro: false, en: 'Create, edit, and delete fuel types',                      km: 'បង្កើត កែ និងលុបប្រភេទឥន្ធនៈ' },
  { can: true,  pro: false, en: 'Create fuel stock income records',                         km: 'បន្ថែមកំណត់ត្រាស្តុកចូល' },
  { can: true,  pro: false, en: 'Create, edit, and delete own sales records',               km: 'បន្ថែម កែ និងលុបកំណត់ត្រាលក់' },
  { can: true,  pro: false, en: 'View all stock and reports',                               km: 'មើលស្តុក និងរបាយការណ៍ទាំងអស់' },
  { can: true,  pro: false, en: 'View per-staff sales reports',                             km: 'មើលរបាយការណ៍លក់ម្នាក់ៗ' },
  { can: true,  pro: true,  en: 'Create and manage staff accounts',                         km: 'បង្កើត និងគ្រប់គ្រងគណនីបុគ្គលិក' },
  { can: true,  pro: true,  en: 'Export reports as Excel files',                            km: 'ទាញយករបាយការណ៍ជា Excel' },
]

const staffFeatures = [
  { can: true,  en: 'View current stock and quantity per fuel type',             km: 'មើលស្តុកបច្ចុប្បន្នរបស់ប្រេងឥន្ធនៈ' },
  { can: true,  en: 'View fuel types, sales reports, and stock income reports',  km: 'មើលប្រភេទឥន្ធនៈ' },
  { can: true,  en: 'Create fuel sales records',                                 km: 'បន្ថែមកំណត់ត្រាលក់ប្រេងឥន្ធនៈ' },
  { can: true,  en: 'Edit own fuel sales records',                               km: 'កែកំណត់ត្រាលក់ផ្ទាល់ខ្លួន' },
  { can: true,  en: 'Edit other staff sales records (same station)',              km: 'កែកំណត់ត្រាបុគ្គលិកដទៃ (ស្ថានីយតែមួយ)' },
  { can: true,  en: 'Delete own sales records only',                             km: 'លុបតែកំណត់ត្រាលក់ខ្លួន' },
  { can: false, en: "Delete another staff member's records (cannot)",            km: 'លុបកំណត់ត្រាបុគ្គលិកដទៃ (មិនអាច)' },
  { can: false, en: 'Create, edit, or delete fuel types (cannot)',               km: 'បង្កើត/កែ/លុប ប្រភេទឥន្ធនៈ (មិនអាច)' },
  { can: false, en: 'Create stock income records (cannot)',                      km: 'បន្ថែមស្តុកចូល (មិនអាច)' },
  { can: false, en: 'Manage other staff accounts (cannot)',                      km: 'គ្រប់គ្រងគណនីបុគ្គលិក (មិនអាច)' },
  { can: false, en: 'Export reports as Excel (cannot)',                          km: 'ទាញ Excel (មិនអាច)' },
]
</script>
