<script setup lang="ts">
import { ref } from 'vue';
import ColorInput from '@/components/ColorInput.vue';

const color = ref('#000000');
</script>

<template>
  <main class="flex items-center justify-center">
    <div class="w-64 shadow-md rounded-md p-4 m-4 space-y-4">
      <div>{{ color }}</div>
      <ColorInput v-model="color" />
    </div>
  </main>
</template>
