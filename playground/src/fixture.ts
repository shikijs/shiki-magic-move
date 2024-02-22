export const vueBefore = `<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`

export const vueAfter = `<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting.toUpperCase() }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`
