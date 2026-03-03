<template>
    <section class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="bg-blue-700 dark:bg-blue-900 shadow-sm sticky top-0 z-10">
            <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <RouterLink
                        to="/auth/login"
                        class="p-2 rounded-lg text-white hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </RouterLink>
                    <div>
                        <h1 class="text-lg font-bold text-white leading-tight">
                            {{ currentLang === 'kh' ? 'គោលការណ៍ប្រព័ន្ធ' : 'System Policy' }}
                        </h1>
                        <p class="text-xs text-blue-200">
                            {{ currentLang === 'kh' ? 'កត់ ប្រេង Pro — កំណែ ១.០' : 'Kot Preng Pro — Version 1.0' }}
                        </p>
                    </div>
                </div>
                <!-- Language Toggle -->
                <button
                    @click="toggleLang"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                    </svg>
                    {{ currentLang === 'kh' ? 'English' : 'ខ្មែរ' }}
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 py-8 pb-16">
            <!-- Cover Card -->
            <div class="bg-blue-700 dark:bg-blue-900 rounded-2xl p-6 mb-8 text-white text-center shadow-lg">
                <div class="text-3xl font-extrabold tracking-wide mb-1">
                    {{ currentLang === 'kh' ? 'កត់ ប្រេង' : 'KOT PRENG PRO' }}
                </div>
                <div class="text-blue-200 text-sm mb-3">
                    {{
                        currentLang === 'kh'
                            ? 'ប្រព័ន្ធគ្រប់គ្រងស្តុកឥន្ធនៈស្ថានីយ័'
                            : 'Gas Station Fuel Inventory Management System'
                    }}
                </div>
                <div
                    class="inline-block bg-blue-500 dark:bg-blue-700 rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide"
                >
                    {{ currentLang === 'kh' ? 'ឯកសារគោលការណ៍ប្រព័ន្ធ' : 'SYSTEM POLICY DOCUMENT' }}
                </div>
                <div class="mt-4 grid grid-cols-2 gap-3 text-left text-xs text-blue-100">
                    <div class="bg-blue-600 dark:bg-blue-800 rounded-lg p-3">
                        <div class="font-semibold text-white mb-1">{{ currentLang === 'kh' ? 'កំណែ' : 'Version' }}</div>
                        <div>1.0 — 2026</div>
                    </div>
                    <div class="bg-blue-600 dark:bg-blue-800 rounded-lg p-3">
                        <div class="font-semibold text-white mb-1">
                            {{ currentLang === 'kh' ? 'អនុវត្តចំពោះ' : 'Applies To' }}
                        </div>
                        <div>{{ currentLang === 'kh' ? 'ម្ចាស់ និងបុគ្គលិក' : 'Owners & Staff' }}</div>
                    </div>
                </div>
            </div>

            <!-- Sections -->
            <div class="space-y-6">
                <!-- Section 1 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '១' : '1'"
                    :title="currentLang === 'kh' ? 'គោលបំណង និងវិសាលភាព' : 'Purpose & Scope'"
                >
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        <template v-if="currentLang === 'kh'">
                            ឯកសារនេះកំណត់លក្ខខណ្ឌ តួនាទី សិទ្ធិ មុខងារ និងគម្រោងការជាវ
                            សម្រាប់អ្នកប្រើប្រាស់ទាំងអស់នៃប្រព័ន្ធ កត់ ប្រេង Pro ដែលអាចប្រើបានតាមទូរស័ព្ទ និងគេហទំព័រ។
                            ការចុះឈ្មោះគណនីមានន័យថា អ្នកប្រើប្រាស់យល់ព្រមអនុវត្តតាមគោលការណ៍នេះទាំងស្រុង។
                        </template>
                        <template v-else>
                            This document defines the terms, roles, permissions, features, and subscription plans
                            governing all users of the Kot Preng Pro system, accessible via both the mobile application
                            and the web platform. By registering an account, all users agree to abide by this policy in
                            full.
                        </template>
                    </p>
                </PolicySection>

                <!-- Section 2 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '២' : '2'"
                    :title="currentLang === 'kh' ? 'ការចុះឈ្មោះគណនី' : 'Account Registration'"
                >
                    <SubSection :title="currentLang === 'kh' ? '២.១ អ្នកណាអាចចុះឈ្មោះ' : '2.1 Who Can Register'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {{
                                currentLang === 'kh'
                                    ? 'ការចុះឈ្មោះគណនីមានតែម្ចាស់ស្ថានីយ័ប៉ុណ្ណោះអាចចុះឈ្មោះគណនីដោយខ្លួនឯង។ គណនីបុគ្គលិកត្រូវបង្កើតដោយម្ចាស់ ពីក្នុងប្រព័ន្ធ។'
                                    : 'Only gas station owners may self-register an account. Staff accounts are created exclusively by the Owner from within the system.'
                            }}
                        </p>
                    </SubSection>

                    <SubSection :title="currentLang === 'kh' ? '២.២ វិធីសាស្ត្រចុះឈ្មោះ' : '2.2 Registration Methods'">
                        <div class="space-y-3">
                            <AuthMethod
                                icon="facebook"
                                :label="currentLang === 'kh' ? 'OAuth 2.0 តាមរយៈ Facebook' : 'OAuth 2.0 via Facebook'"
                            >
                                {{
                                    currentLang === 'kh'
                                        ? 'ចូលប្រព័ន្ធដោយសុវត្ថិភាពតាមគណនី Facebook ដែលមានស្រាប់។ ប្រព័ន្ធនឹងបង្កើតគណនីម្ចាស់ ភ្ជាប់ជាមួយ Facebook ដោយស្វ័យប្រវត្តិ។'
                                        : 'Log in securely using an existing Facebook account. The system will automatically create an Owner account linked to the Facebook profile.'
                                }}
                            </AuthMethod>
                            <AuthMethod
                                icon="google"
                                :label="currentLang === 'kh' ? 'OAuth 2.0 តាមរយៈ Google' : 'OAuth 2.0 via Google'"
                            >
                                {{
                                    currentLang === 'kh'
                                        ? 'ចូលប្រព័ន្ធដោយសុវត្ថិភាពតាមគណនី Google ដែលមានស្រាប់។ ប្រព័ន្ធនឹងបង្កើត និងភ្ជាប់គណនីម្ចាស់ ទៅ Google ដោយស្វ័យប្រវត្តិ។'
                                        : 'Log in securely using an existing Google account. The system will automatically create and link the Owner account to the Google profile on first login.'
                                }}
                            </AuthMethod>
                            <AuthMethod
                                icon="phone"
                                :label="currentLang === 'kh' ? 'លេខទូរស័ព្ទ + OTP' : 'Phone Number + OTP'"
                            >
                                {{
                                    currentLang === 'kh'
                                        ? 'ចុះឈ្មោះដោយប្រើលេខទូរស័ព្ទដែលមានសុពលភាព។ OTP នឹងផ្ញើតាម SMS ដើម្បីផ្ទៀងផ្ទាត់ មុនពេលបើកគណនី។'
                                        : 'Register using a valid phone number. A one-time password (OTP) will be sent via SMS to verify ownership before the account is activated.'
                                }}
                            </AuthMethod>
                            <AuthMethod
                                icon="email"
                                :label="currentLang === 'kh' ? 'អ៊ីមែល + OTP' : 'Email Address + OTP'"
                            >
                                {{
                                    currentLang === 'kh'
                                        ? 'ចុះឈ្មោះដោយប្រើអ៊ីមែលដែលមានសុពលភាព។ OTP នឹងផ្ញើទៅអ៊ីមែល ដើម្បីផ្ទៀងផ្ទាត់ មុនពេលបើកគណនី។'
                                        : 'Register using a valid email address. An OTP will be sent to verify ownership before the account is activated.'
                                }}
                            </AuthMethod>
                        </div>
                    </SubSection>

                    <SubSection :title="currentLang === 'kh' ? '២.៣ ប្រភេទឥន្ធនៈលំនាំដើម' : '2.3 Default Fuel Types'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {{
                                currentLang === 'kh'
                                    ? 'នៅពេលចុះឈ្មោះ ប្រព័ន្ធនឹងបង្កើតប្រភេទឥន្ធនៈលំនាំដើមដូចខាងក្រោមដោយស្វ័យប្រវត្តិ៖'
                                    : 'Upon registration, the system automatically creates the following default fuel types:'
                            }}
                        </p>
                        <div class="grid grid-cols-2 gap-2">
                            <FuelTag
                                name="Regular"
                                :desc="currentLang === 'kh' ? 'សាំងធម្មតា' : 'Regular Gasoline'"
                                color="blue"
                            />
                            <FuelTag
                                name="Super"
                                :desc="currentLang === 'kh' ? 'សាំងស៊ុបព័រ' : 'Super Gasoline'"
                                color="green"
                            />
                            <FuelTag
                                name="Diesel"
                                :desc="currentLang === 'kh' ? 'ម៉ាស៊ូត' : 'Diesel Fuel'"
                                color="yellow"
                            />
                            <FuelTag
                                name="Gas"
                                :desc="currentLang === 'kh' ? 'ហ្គាស LPG/CNG' : 'LPG / CNG'"
                                color="purple"
                            />
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-xs mt-3">
                            {{
                                currentLang === 'kh'
                                    ? '* ម្ចាស់អាចបន្ថែម ប្ដូរឈ្មោះ ឬលុបប្រភេទឥន្ធនៈបន្ទាប់ពីចុះឈ្មោះ។'
                                    : '* Owners may add, rename, or remove fuel types at any time after registration.'
                            }}
                        </p>
                    </SubSection>
                </PolicySection>

                <!-- Section 3 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៣' : '3'"
                    :title="currentLang === 'kh' ? 'តួនាទី និងសិទ្ធិអ្នកប្រើប្រាស់' : 'User Roles & Permissions'"
                >
                    <!-- Owner -->
                    <SubSection :title="currentLang === 'kh' ? '៣.១ ម្ចាស់' : '3.1 Owner'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {{
                                currentLang === 'kh'
                                    ? 'ម្ចាស់ជាម្ចាស់គណនីចម្បង មានអំណាចគ្រប់គ្រង និងប្រតិបត្តិការពេញលេញ។'
                                    : 'The Owner is the primary account holder with full administrative and operational control.'
                            }}
                        </p>
                        <div class="space-y-1.5">
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'ចុះឈ្មោះ និងគ្រប់គ្រងគណនីស្ថានីយ័'
                                        : 'Register and manage the gas station account'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'បង្កើត កែ និងលុបប្រភេទឥន្ធនៈ'
                                        : 'Create, edit, and delete fuel types'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'បង្កើតកំណត់ត្រាស្តុកឥន្ធនៈចូល'
                                        : 'Create fuel stock income records'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'បង្កើត កែ និងលុបកំណត់ត្រាលក់ផ្ទាល់ខ្លួន'
                                        : 'Create, edit, and delete own sales records'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh' ? 'មើលស្តុក និងរបាយការណ៍ទាំងអស់' : 'View all stock and reports'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'មើលរបាយការណ៍លក់ក្នុងមួយបុគ្គលិក'
                                        : 'View per-staff sales reports'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :pro="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'បង្កើត និងគ្រប់គ្រងគណនីបុគ្គលិក'
                                        : 'Create and manage staff accounts'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :pro="true"
                                :label="
                                    currentLang === 'kh' ? 'នាំចេញរបាយការណ៍ជា Excel' : 'Export reports as Excel files'
                                "
                            />
                        </div>
                    </SubSection>

                    <!-- Staff -->
                    <SubSection :title="currentLang === 'kh' ? '៣.២ បុគ្គលិក' : '3.2 Staff'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {{
                                currentLang === 'kh'
                                    ? 'គណនីបុគ្គលិកត្រូវបង្កើតដោយម្ចាស់។ កំណត់ត្រាលក់ត្រូវចុះឈ្មោះទៅបុគ្គលិកម្នាក់ៗ ដើម្បីតាមដានការលក់ក្នុងមួយបុគ្គលិក។'
                                    : 'Staff accounts are created by the Owner. Each sales record is attributed to the staff member who created it, enabling per-person sales tracking.'
                            }}
                        </p>
                        <div class="space-y-1.5 mb-3">
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'មើលស្តុកបច្ចុប្បន្ន និងបរិមាណក្នុងមួយប្រភេទ'
                                        : 'View current stock and quantity per fuel type'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'មើលប្រភេទឥន្ធនៈ របាយការណ៍លក់ និងស្តុកចូល'
                                        : 'View fuel types, sales reports, and stock income reports'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="currentLang === 'kh' ? 'បង្កើតកំណត់ត្រាលក់ឥន្ធនៈ' : 'Create fuel sales records'"
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh' ? 'កែកំណត់ត្រាលក់ផ្ទាល់ខ្លួន' : 'Edit own fuel sales records'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'កែកំណត់ត្រាបុគ្គលិកដទៃ (ស្ថានីយ័តែមួយ)'
                                        : 'Edit other staff sales records (same station)'
                                "
                            />
                            <PermissionRow
                                :allowed="true"
                                :label="
                                    currentLang === 'kh'
                                        ? 'លុបកំណត់ត្រាលក់ផ្ទាល់ខ្លួនប៉ុណ្ណោះ'
                                        : 'Delete own sales records only'
                                "
                            />
                        </div>
                        <div class="space-y-1.5">
                            <PermissionRow
                                :allowed="false"
                                :label="
                                    currentLang === 'kh'
                                        ? 'លុបកំណត់ត្រាលក់របស់បុគ្គលិកដទៃ'
                                        : 'Delete another staff member\'s records'
                                "
                            />
                            <PermissionRow
                                :allowed="false"
                                :label="
                                    currentLang === 'kh'
                                        ? 'បង្កើត កែ ឬលុបប្រភេទឥន្ធនៈ'
                                        : 'Create, edit, or delete fuel types'
                                "
                            />
                            <PermissionRow
                                :allowed="false"
                                :label="
                                    currentLang === 'kh' ? 'បង្កើតកំណត់ត្រាស្តុកចូល' : 'Create stock income records'
                                "
                            />
                            <PermissionRow
                                :allowed="false"
                                :label="
                                    currentLang === 'kh' ? 'គ្រប់គ្រងគណនីបុគ្គលិកដទៃ' : 'Manage other staff accounts'
                                "
                            />
                            <PermissionRow
                                :allowed="false"
                                :label="currentLang === 'kh' ? 'នាំចេញ Excel' : 'Export reports as Excel'"
                            />
                        </div>
                    </SubSection>
                </PolicySection>

                <!-- Section 4 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៤' : '4'"
                    :title="currentLang === 'kh' ? 'ការគ្រប់គ្រងឥន្ធនៈ' : 'Fuel Management'"
                >
                    <SubSection :title="currentLang === 'kh' ? '៤.១ ប្រភេទឥន្ធនៈ' : '4.1 Fuel Types'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {{
                                currentLang === 'kh'
                                    ? 'តែម្ចាស់ប៉ុណ្ណោះអាចបង្កើត ប្ដូរឈ្មោះ ឬលុបប្រភេទឥន្ធនៈ។ ប្រភេទឥន្ធនៈជាកម្មសិទ្ធិផ្តាច់មុខរបស់ស្ថានីយ័ ហើយមិនចែករំលែក។ មិនអាចលុបប្រភេទឥន្ធនៈដែលមានប្រវត្តិកំណត់ត្រាការលក់ឬកំណត់ត្រាស្តុក។'
                                    : 'Only Owners can create, rename, or delete fuel types. Fuel types belong exclusively to their gas station and are never shared. Can not deleting a fuel type if there is historical record of sales or stock records.'
                            }}
                        </p>
                    </SubSection>
                    <SubSection :title="currentLang === 'kh' ? '៤.២ កំណត់ត្រាស្តុកចូល' : '4.2 Stock Income Records'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {{
                                currentLang === 'kh'
                                    ? 'តែម្ចាស់ប៉ុណ្ណោះអាចបង្កើតកំណត់ត្រាស្តុកចូល។ កំណត់ត្រានីមួយៗត្រូវរួមបញ្ចូល ប្រភេទឥន្ធនៈ បរិមាណ កាលបរិច្ឆេទ/ម៉ោង។ ឥន្ធនៈដែលបញ្ចូលត្រូវបន្ថែមទៅសមតុល្យស្តុកផ្ទាល់។'
                                    : 'Only the Owner may create stock income records. Each record must include fuel type, quantity, and date/time. Records directly increase the tracked stock level.'
                            }}
                        </p>
                    </SubSection>
                    <SubSection :title="currentLang === 'kh' ? '៤.៣ កំណត់ត្រាលក់' : '4.3 Sales Records'">
                        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {{
                                currentLang === 'kh'
                                    ? 'ទាំងម្ចាស់ និងបុគ្គលិកអាចបង្កើតកំណត់ត្រាលក់។ ការលក់នីមួយៗត្រូវចុះឈ្មោះទៅអ្នកបង្កើត ហើយកាត់ចំណែកស្តុកផ្ទាល់។ បុគ្គលិកអាចកែកំណត់ត្រារបស់ខ្លួន និងរបស់បុគ្គលិកដទៃ ប៉ុន្តែអាចលុបតែកំណត់ត្រាផ្ទាល់ខ្លួន។'
                                    : 'Both Owners and Staff may create sales records. Each sale is attributed to the user who created it and directly reduces stock. Staff may edit any staff record but can only delete their own.'
                            }}
                        </p>
                    </SubSection>
                </PolicySection>

                <!-- Section 5 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៥' : '5'"
                    :title="currentLang === 'kh' ? 'ការតាមដានស្តុក និងរបាយការណ៍' : 'Stock Tracking & Reporting'"
                >
                    <div
                        class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-4 text-center"
                    >
                        <p class="text-xs text-blue-600 dark:text-blue-300 mb-1">
                            {{ currentLang === 'kh' ? 'រូបមន្តគណនាស្តុក' : 'Stock Calculation Formula' }}
                        </p>
                        <p class="font-bold text-blue-800 dark:text-blue-200 text-sm">
                            {{
                                currentLang === 'kh'
                                    ? 'ស្តុកបច្ចុប្បន្ន = ស្តុកចូលសរុប − ការលក់សរុប'
                                    : 'Current Stock = Total Stock Income − Total Sales'
                            }}
                        </p>
                    </div>
                    <div class="space-y-2">
                        <ReportRow
                            :title="currentLang === 'kh' ? 'របាយការណ៍លក់ឥន្ធនៈ' : 'Fuel Sales Report'"
                            :owner="true"
                            :staff="true"
                            :owner-label="currentLang === 'kh' ? 'ម្ចាស់' : 'Owner'"
                            :staff-label="currentLang === 'kh' ? 'បុគ្គលិក' : 'Staff'"
                            :desc="
                                currentLang === 'kh'
                                    ? 'ត្រងតាមកាលបរិច្ឆេទ ប្រភេទ បុគ្គលិក'
                                    : 'Filter by date, fuel type, staff'
                            "
                        />
                        <ReportRow
                            :owner-label="currentLang === 'kh' ? 'ម្ចាស់' : 'Owner'"
                            :staff-label="currentLang === 'kh' ? 'បុគ្គលិក' : 'Staff'"
                            :title="currentLang === 'kh' ? 'របាយការណ៍ស្តុកចូល' : 'Stock Income Report'"
                            :owner="true"
                            :staff="true"
                            :desc="currentLang === 'kh' ? 'ត្រងតាមកាលបរិច្ឆេទ ប្រភេទ' : 'Filter by date, fuel type'"
                        />
                        <ReportRow
                            :owner-label="currentLang === 'kh' ? 'ម្ចាស់' : 'Owner'"
                            :staff-label="currentLang === 'kh' ? 'បុគ្គលិក' : 'Staff'"
                            :title="currentLang === 'kh' ? 'របាយការណ៍លក់ក្នុងមួយបុគ្គលិក' : 'Per-Staff Sales Report'"
                            :owner="true"
                            :staff="false"
                            :staffNote="currentLang === 'kh' ? 'ផ្ទាល់ខ្លួនប៉ុណ្ណោះ' : 'Own records only'"
                            :desc="
                                currentLang === 'kh'
                                    ? 'ម្ចាស់: ទាំងអស់ / បុគ្គលិក: ផ្ទាល់ខ្លួន'
                                    : 'Owner: all / Staff: own only'
                            "
                        />
                        <ReportRow
                            :owner-label="currentLang === 'kh' ? 'ម្ចាស់' : 'Owner'"
                            :staff-label="currentLang === 'kh' ? 'បុគ្គលិក' : 'Staff'"
                            :title="currentLang === 'kh' ? 'នាំចេញ Excel' : 'Excel Export'"
                            :owner="true"
                            :ownerNote="currentLang === 'kh' ? 'Pro តែប៉ុណ្ណោះ' : 'Pro only'"
                            :staff="false"
                            :desc="currentLang === 'kh' ? 'គម្រោង Pro ម្ចាស់ប៉ុណ្ណោះ' : 'Owner Pro plan only'"
                        />
                    </div>
                </PolicySection>

                <!-- Section 6 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៦' : '6'"
                    :title="currentLang === 'kh' ? 'គម្រោងការជាវ និងតម្លៃ' : 'Subscription & Pricing'"
                >
                    <!-- Trial -->
                    <div
                        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-4"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            <span class="font-semibold text-green-800 dark:text-green-300 text-sm">
                                {{
                                    currentLang === 'kh'
                                        ? 'ការសាកល្បងឥតគិតថ្លៃ — ៣ ទៅ ៦ ខែ'
                                        : 'Free Trial — 3 to 6 Months'
                                }}
                            </span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                            {{
                                currentLang === 'kh'
                                    ? 'ម្ចាស់ថ្មីទាំងអស់ទទួលបានការប្រើប្រាស់ Pro ពេញលេញ ឥតគិតថ្លៃ រយៈពេល ៣ ទៅ ៦ ខែ។ រយៈពេលអាចប្រែប្រួលតាមការផ្សព្វផ្សាយ។'
                                    : 'All new Owner accounts receive full Pro access for free for 3 to 6 months. The exact duration may vary based on active promotions.'
                            }}
                        </p>
                    </div>

                    <!-- Plan Comparison Table -->
                    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                        <table class="w-full text-xs">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-800">
                                    <th class="text-left px-3 py-2.5 text-gray-600 dark:text-gray-300 font-semibold">
                                        {{ currentLang === 'kh' ? 'មុខងារ' : 'Feature' }}
                                    </th>
                                    <th class="text-center px-3 py-2.5 text-blue-600 dark:text-blue-400 font-semibold">
                                        {{ currentLang === 'kh' ? 'សាកល្បង' : 'Trial' }}
                                    </th>
                                    <th class="text-center px-3 py-2.5 text-blue-700 dark:text-blue-300 font-bold">
                                        Pro
                                    </th>
                                    <th class="text-center px-3 py-2.5 text-gray-500 dark:text-gray-400 font-semibold">
                                        {{ currentLang === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free' }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                                <PlanRow
                                    :feature="currentLang === 'kh' ? 'បង្កើតប្រភេទឥន្ធនៈ' : 'Create fuel types'"
                                    :trial="true"
                                    :pro="true"
                                    :free="true"
                                />
                                <PlanRow
                                    :feature="currentLang === 'kh' ? 'បង្កើតកំណត់ត្រាលក់' : 'Create sales records'"
                                    :trial="true"
                                    :pro="true"
                                    :free="true"
                                />
                                <PlanRow
                                    :feature="
                                        currentLang === 'kh' ? 'បង្កើតកំណត់ត្រាស្តុកចូល' : 'Create stock income records'
                                    "
                                    :trial="true"
                                    :pro="true"
                                    :free="true"
                                />
                                <PlanRow
                                    :feature="currentLang === 'kh' ? 'មើលរបាយការណ៍ទាំងអស់' : 'View all reports'"
                                    :trial="true"
                                    :pro="true"
                                    :free="true"
                                />
                                <PlanRow
                                    :feature="
                                        currentLang === 'kh' ? 'បង្កើត និងគ្រប់គ្រងបុគ្គលិក' : 'Create & manage staff'
                                    "
                                    :trial="true"
                                    :pro="true"
                                    :free="false"
                                />
                                <PlanRow
                                    :feature="currentLang === 'kh' ? 'បុគ្គលិកចូលប្រើ' : 'Existing staff access'"
                                    :trial="true"
                                    :pro="true"
                                    :free="false"
                                    :freeNote="currentLang === 'kh' ? 'ផ្អាក' : 'Suspended'"
                                />
                                <PlanRow
                                    :feature="currentLang === 'kh' ? 'នាំចេញ Excel' : 'Export Excel'"
                                    :trial="true"
                                    :pro="true"
                                    :free="false"
                                />
                                <tr class="bg-blue-50 dark:bg-blue-900/20">
                                    <td class="px-3 py-2.5 font-semibold text-gray-700 dark:text-gray-200">
                                        {{ currentLang === 'kh' ? 'ថ្លៃខែ' : 'Monthly cost' }}
                                    </td>
                                    <td class="text-center px-3 py-2.5 font-bold text-green-600">$0</td>
                                    <td class="text-center px-3 py-2.5 font-bold text-blue-700 dark:text-blue-300">
                                        $10
                                    </td>
                                    <td class="text-center px-3 py-2.5 font-bold text-green-600">$0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Free plan note -->
                    <div
                        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mt-4"
                    >
                        <div class="flex items-start gap-2">
                            <svg
                                class="w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <p class="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                                {{
                                    currentLang === 'kh'
                                        ? 'ប្រសិនបើម្ចាស់មិនជាវ Pro ប្រព័ន្ធនឹងផ្អាកគណនីបុគ្គលិកទាំងអស់ ហើយមិនអាចនាំចេញ Excel។ ការ Upgrade ទៅ Pro នឹងបើកគណនីបុគ្គលិកឡើងវិញភ្លាមៗ។'
                                        : 'If the Owner does not subscribe to Pro, all staff accounts are suspended and Excel export is disabled. Upgrading to Pro immediately reactivates all staff accounts.'
                                }}
                            </p>
                        </div>
                    </div>
                </PolicySection>

                <!-- Section 7 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៧' : '7'"
                    :title="currentLang === 'kh' ? 'ទិន្នន័យ និងភាពឯកជន' : 'Data & Privacy'"
                >
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {{
                            currentLang === 'kh'
                                ? 'ទិន្នន័យទាំងអស់ជារបស់ម្ចាស់គណនី ហើយមិនចែករំលែករវាងគណនីស្ថានីយ័ផ្សេង។ ប្រព័ន្ធនឹងមិនលក់ ចែករំលែក ឬចែកចាយទិន្នន័យទៅភាគីទីបីឡើយ លើកលែងតែតម្រូវដោយច្បាប់។'
                                : "All data belongs to the registered Owner's account and is never shared between gas station accounts. The system operator will not sell or distribute account data to third parties except as required by law."
                        }}
                    </p>
                </PolicySection>

                <!-- Section 8 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៨' : '8'"
                    :title="currentLang === 'kh' ? 'ការបញ្ចប់ និងការផ្អាកគណនី' : 'Account Termination & Suspension'"
                >
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {{
                            currentLang === 'kh'
                                ? 'ប្រព័ន្ធរក្សាសិទ្ធិផ្អាក ឬបញ្ចប់គណនីណាដែលបំពានគោលការណ៍ ឬប្រព្រឹត្តការក្លែងបន្លំ។ ម្ចាស់ដែលមិនបន្ថែម Pro នឹងត្រូវបន្ទាបទៅគម្រោងឥតគិតថ្លៃ ប៉ុន្តែគណនីបុគ្គលិកនឹងត្រូវបើកឡើងវិញនៅពេល Upgrade។'
                                : 'The system operator may suspend or terminate accounts found to violate this policy or engage in fraudulent activity. Owners who do not renew Pro are downgraded to Free — their account is not deleted, and staff accounts are restored upon upgrading.'
                        }}
                    </p>
                </PolicySection>

                <!-- Section 9 -->
                <PolicySection
                    :number="currentLang === 'kh' ? '៩' : '9'"
                    :title="currentLang === 'kh' ? 'ការធ្វើបច្ចុប្បន្នភាពគោលការណ៍' : 'Policy Updates'"
                >
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {{
                            currentLang === 'kh'
                                ? 'គោលការណ៍នេះអាចត្រូវបានធ្វើបច្ចុប្បន្នភាព ដើម្បីឆ្លុះបញ្ចាំងការផ្លាស់ប្ដូរមុខងារ តម្លៃ ឬច្បាប់។ អ្នកប្រើប្រាស់នឹងត្រូវជូនដំណឹងតាម App ឬអ៊ីមែល។ ការបន្តប្រើប្រព័ន្ធបន្ទាប់ពីការជូនដំណឹង ស្មើនឹងការទទួលស្គាល់គោលការណ៍ថ្មី។'
                                : 'This policy may be updated to reflect changes in features, pricing, or legal requirements. Users will be notified via app or email. Continued use after notification constitutes acceptance of the updated policy.'
                        }}
                    </p>
                </PolicySection>
            </div>

            <!-- Footer -->
            <div class="mt-10 text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
                {{
                    currentLang === 'kh'
                        ? 'កត់ ប្រេង Pro — កំណែ ១.០ | © ២០២៦ រក្សាសិទ្ធិទាំងអស់'
                        : 'Kot Preng Pro — Version 1.0 | © 2026 All Rights Reserved'
                }}
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { RouterLink } from 'vue-router'

    import PolicySection from './Policy/PolicySection.vue'
    import PermissionRow from './Policy/PermissionRow.vue'
    import FuelTag from './Policy/FuelTag.vue'
    import ReportRow from './Policy/ReportRow.vue'
    import PlanRow from './Policy/PlanRow.vue'
    import AuthMethod from './Policy/AuthMethod.vue'

    const currentLang = ref('kh')
    const toggleLang = () => {
        currentLang.value = currentLang.value === 'en' ? 'kh' : 'en'
    }
</script>
