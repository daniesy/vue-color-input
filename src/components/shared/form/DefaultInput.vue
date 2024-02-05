<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
  get(): string {
    return props.modelValue;
  },
  set(value: string) {
    emit('update:modelValue', value);
  }
});
</script>

<template>
  <input
    v-model="model"
    :type="type"
    class="px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 focus:bg-gray-100 focus:ring-2 ring-blue-500 dark:ring-blue-800 dark:focus:bg-gray-700 hover:bg-gray-100/90 dark:hover:bg-zinc-700/90 rounded-md block w-full border-0 outline-none text-gray-700 dark:text-zinc-300 placeholder:text-gray-400 dark:placeholder:text-zinc-600 sm:text-sm sm:leading-6"
  />
</template>
