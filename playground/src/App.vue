<script setup lang="ts">
import Block from './Block.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <Block />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
