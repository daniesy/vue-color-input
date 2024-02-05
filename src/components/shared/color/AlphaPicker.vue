<script setup lang="ts">
import { computed, ref } from 'vue';
import { Color, ColorFormat } from '@/support/color/Color';

interface Props {
  modelValue: number;
  startColor: Color;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const model = computed({
  get(): number {
    return props.modelValue * 100;
  },
  set(value: number) {
    if (value === props.modelValue * 100) {
      return;
    }
    return emit('update:modelValue', parseFloat((value / 100).toFixed(2)));
  }
});

const gradientElement = ref<HTMLCanvasElement>();
const isDragging = ref(false);

const color = computed(() => props.startColor.clone().addAlpha(model.value / 100));
const gradient = computed(
  () =>
    `background: linear-gradient(to right, ${props.startColor.to(ColorFormat.RGBA).addAlpha(0)} 0%, ${props.startColor.to(ColorFormat.RGB)} 100%)`
);

const startDragging = () => {
  isDragging.value = true;

  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', stopDragging);
};

const drag = (e: MouseEvent) => {
  const { left, width } = gradientElement.value!.getBoundingClientRect();
  const x = e.clientX - left;
  model.value = Math.min(100, Math.max(0, (x / width) * 100));
};

const stopDragging = () => {
  isDragging.value = false;

  window.removeEventListener('mousemove', drag);
  window.removeEventListener('mouseup', stopDragging);
};

const jumpAndStartDragging = (e: MouseEvent) => {
  const { left, width } = gradientElement.value!.getBoundingClientRect();
  const x = e.clientX - left;
  model.value = Math.min(100, Math.max(0, (x / width) * 100));

  startDragging();
};
</script>

<template>
  <div ref="gradientElement" class="alpha relative select-none">
    <div
      class="gradient rounded-md cursor-pointer"
      :style="gradient"
      @mousedown.prevent="jumpAndStartDragging"
    />
    <div
      ref="cursor"
      :style="{ left: `${model}%`, background: color.toString() }"
      @mousedown.prevent="startDragging"
      :class="{ dragging: isDragging }"
      class="absolute cursor cursor-grab active:cursor-grabbing rounded-full box-content border-4 border-white"
    />
  </div>
</template>

<style scoped lang="scss">
.alpha {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;

  .gradient {
    width: 100%;
    height: 12px;
    display: block;
  }

  .cursor {
    width: 16px;
    height: 16px;
    top: 50%;

    transform: translate(-50%, -50%);
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.1);

    transition: all 0.2s ease-in-out;

    &.dragging,
    &:active {
      transform: translate(-50%, -50%) scale(0.96);
      transition: none;
    }
  }
}
</style>
