<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';
import { position as vPosition } from '@/directives/position';
import { clickOutside as vClickOutside } from '@/directives/clickOutside';
import { focus as vFocus } from '@/directives/focus';
import ColorPicker from '@/components/shared/color/ColorPicker.vue';
import DefaultInput from '@/components/shared/form/DefaultInput.vue';
import { isValidColor } from '@/support/color/Factory';
import { generateUUID } from '@/support/other/uuid';

interface Props {
  modelValue: string;
  id?: string;
  inline?: boolean;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  id: generateUUID(),
  autofocus: false
});
const emit = defineEmits(['update:modelValue', 'change']);
const slots = useSlots();

const model = computed({
  get(): string {
    return props.modelValue.trim().replace(/\s/g, '');
  },
  set(value: string) {
    emit('update:modelValue', value);
    emit('change', value);
  }
});

const pickerVisible = ref(false);
const hidePicker = (event: MouseEvent) => {
  if (event.target instanceof HTMLElement && !event.target.closest('.color-block')) {
    pickerVisible.value = false;
  }
};
const colorChanged = () => (pickerVisible.value = false);

const inputFocused = ({ target }: { target: HTMLInputElement }) =>
  setTimeout(() => target.select());
const hasSlot = (name: string = 'default') => !!slots[name];

const togglePicker = () => (pickerVisible.value = !pickerVisible.value);
</script>

<template>
  <div class="relative">
    <label v-if="hasSlot()" class="text-xxs select-none text-gray-400 dark:text-zinc-600" :for="id"
      ><slot
    /></label>

    <ColorPicker
      v-if="pickerVisible || inline"
      v-position="!inline"
      v-click-outside="hidePicker"
      v-model="model"
      :inline="inline"
      @change="colorChanged"
      :class="[inline ? 'relative my-5' : 'absolute p-4 rounded-md']"
      class="z-20"
    />

    <div class="flex gap-3 justify-between items-center">
      <div class="relative flex flex-1 gap-3 justify-between items-center">
        <DefaultInput
          @focus="inputFocused"
          :id="id"
          class="pr-10"
          v-model="model"
          v-focus="autofocus"
        />

        <div
          class="color-block absolute right-3 top-2.5 w-6 h-6 rounded-md shadow-md"
          :class="{ empty: !isValidColor(model), 'cursor-pointer': !inline }"
          :style="{ backgroundColor: isValidColor(model) ? model : 'transparent' }"
          @click.prevent="togglePicker"
        />
      </div>
      <slot name="after" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.color-block {
  &.empty {
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%),
      linear-gradient(-45deg, #eee 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #eee 75%),
      linear-gradient(-45deg, transparent 75%, #eee 75%);
    background-size: 8px 8px;
    background-position:
      0 0,
      0 4px,
      4px -4px,
      -4px 0px;
  }
}
</style>
