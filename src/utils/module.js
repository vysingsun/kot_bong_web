const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { log } = require('console')
const moduleName = process.argv[2]

/*
    @desc Auto Generate Folder for Router
 */
const setupRouteFolder = (folderPath, moduleName) => {
  try {
    const content = `
import prefetchResources from '@/middlewares/prefetch-resources'

const MODULE_NAME = '${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}'
const MODULE_PATH = '/${moduleName}'

export const routes = [
    {
        module: MODULE_NAME,
        name: 'list',
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/${moduleName}/views/index.vue'),
    },
]

const ${moduleName.toUpperCase()}_ROUTES = [
    {
        children: routes,
        initModule: MODULE_NAME.toLowerCase(),
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            middleware: [prefetchResources],
            moduleName: MODULE_NAME,
        },
        beforeEnter: async (to: any, from: any, next: any) => {
            next()
        },
    },
]

export const ${moduleName.toUpperCase()} = { ${moduleName.toUpperCase()}_ROUTES, MODULE_NAME, MODULE_PATH }
        `
    fs.writeFileSync(path.join(folderPath, 'index.ts'), content)
  } catch (err) {
    console.error(chalk.black.bgRed('Error creating file'), err.message)
  }
}

/*
    @desc Auto Generate Folder for Service
 */
const setupServiceFolder = (folderPath, moduleName) => {
  try {
    const content = `
import axios from 'axios'
class ApiService {
    async getAll<T>(params?: object): Promise<T> {
        return axios.get('${moduleName}', params)
    }
    async read<T>(id: number): Promise<T> {
         return axios.get('${moduleName}/' + id)
    }
    async create<T>(formData: object): Promise<T> {
        return axios.post('${moduleName}', formData)
    }
    async update<T>(id: number, formData: object): Promise<T> {
        return axios.put('${moduleName}/' + id, formData)
    }

    async delete<T>(id: number): Promise<T> {
        return axios.delete('${moduleName}/' + id)
    }
}
export default new ApiService()
        `
    fs.writeFileSync(path.join(folderPath, 'api.service.ts'), content)
  } catch (err) {
    console.error(chalk.black.bgRed('Error creating file'), err.message)
  }
}

/*
    @desc Auto Generate Folder for Store
 */
const setupStoreFolder = (folderPath, moduleName) => {
  try {
    const content = `
import { defineStore } from 'pinia'

interface I${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store {}

export const use${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store = defineStore('${moduleName}Store', {
    state: (): I${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store => ({}),
    getters: {},
    actions: {},
})

        `
    fs.writeFileSync(path.join(folderPath, 'index.ts'), content)
  } catch (err) {
    console.error(chalk.black.bgRed('Error creating file'), err.message)
  }
}

/*
    @desc Auto Generate Folder for View
 */
const setupViewFolder = (folderPath, moduleName) => {
  try {
    const contentForm = `
<template>
  <div>
    <h1>Form ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Page</h1>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
        `

    const contentIndex = `
<template>
  <div>
    <h1>${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Index Page</h1>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>

</style>

        `
    fs.writeFileSync(path.join(folderPath, 'form.vue'), contentForm)
    fs.writeFileSync(path.join(folderPath, 'index.vue'), contentIndex)
  } catch (err) {
    console.error(chalk.black.bgRed('Error creating file'), err.message)
  }
}

/*
    @desc Auto Generate Folder for Locales
 */
const setupLocalesFolder = (folderPath, moduleName) => {
  try {
    const content = `
{
    "${moduleName}": "${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}"
}
        `
    fs.writeFileSync(path.join(folderPath, 'en.json'), content)
    fs.writeFileSync(path.join(folderPath, 'kh.json'), content)
  } catch (err) {
    console.error(chalk.black.bgRed('Error creating file'), err.message)
  }
}

/*
    @desc Auto Generate Folder and SubFolder
 */
const createFolder = (targetDir) => {
  const sep = path.sep
  const baseDir = path.resolve('./src/modules')
  const folders = targetDir.split(sep)
  let currentPath = ''

  currentPath = path.join(baseDir, currentPath, targetDir)
  console.log(currentPath, 'crr path')

  try {
    fs.mkdirSync(currentPath)
    fs.mkdirSync(currentPath + '/assets')
    fs.mkdirSync(currentPath + '/router')
    fs.mkdirSync(currentPath + '/services')
    fs.mkdirSync(currentPath + '/store')
    fs.mkdirSync(currentPath + '/components')
    fs.mkdirSync(currentPath + '/views')
    fs.mkdirSync(currentPath + '/locales')

    // Get last path of folder set as module name
    const moduleName = path.basename(currentPath)
    setupRouteFolder(currentPath + '/router', moduleName)
    setupServiceFolder(currentPath + '/services', moduleName)
    setupViewFolder(currentPath + '/views', moduleName)
    setupStoreFolder(currentPath + '/store', moduleName)
    setupLocalesFolder(currentPath + '/locales', moduleName)
    console.log(chalk.black.bgGreen('Create module successfully'), currentPath)
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.error(chalk.black.bgRed('Module already exists!'), currentPath)
    } else {
      console.error(chalk.black.bgRed('Error creating folder'), currentPath)
    }
  }
}

createFolder(moduleName)
