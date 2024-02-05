<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ColorFormat } from '@/support/color/Color';
import type HSVColor from '@/support/color/HSVColor';
import type HSLAColor from '@/support/color/HSLAColor';

interface Props {
  hsla: HSLAColor;
}

const props = defineProps<Props>();
const emit = defineEmits(['change']);

const startColor = computed(() => {
  const h = props.hsla.hue;
  const s = 100;
  const l = 50;
  return `hsl(${h}, ${s}%, ${l}%)`;
});

const gradientElement = ref<HTMLCanvasElement>();
const isDragging = ref(false);
const percentX = ref(0);
const percentY = ref(0);

const fill = computed(() => `background: ${startColor.value}`);

const findPercentages = () => {
  // generate x and y percentage from saturation and lightness
  if (!gradientElement.value) {
    return;
  }

  const hsv = props.hsla.to(ColorFormat.HSV) as HSVColor;

  percentX.value = hsv.saturation;
  percentY.value = 100 - hsv.value;
};

const startDragging = () => {
  isDragging.value = true;
  getColorUnderCursor();

  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', stopDragging);
};

const drag = (e: MouseEvent) => {
  const { left, width, top, height } = gradientElement.value!.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;
  percentX.value = Math.min(100, Math.max(0, (x / width) * 100));
  percentY.value = Math.min(100, Math.max(0, (y / height) * 100));

  getColorUnderCursor();
};

const stopDragging = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', drag);
  window.removeEventListener('mouseup', stopDragging);
};

const jumpAndStartDragging = (e: MouseEvent) => {
  drag(e);
  startDragging();
};

const getColorUnderCursor = () => {
  const hsvValue = 1 - percentY.value / 100;
  const hsvSaturation = percentX.value / 100;
  const lightness = (hsvValue / 2) * (2 - hsvSaturation);

  if (lightness === 0 || lightness === 1) {
    emit('change', 0, hsvValue * 100);
    return;
  }

  const resultedSaturation = Math.round(
      ((hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1))) * 100
    ),
    resultedLightness = Math.round(lightness * 100);

  if (props.hsla.saturation === resultedSaturation && props.hsla.lightness === resultedLightness) {
    return;
  }

  emit('change', resultedSaturation, resultedLightness);
};

watch(
  () => props.hsla,
  () => {
    findPercentages();
  },
  { immediate: true }
);

onMounted(() => {
  findPercentages();
});
</script>

<template>
  <div ref="gradientElement" class="color relative shadow-md rounded-md">
    <div
      class="gradient rounded-md cursor-pointer"
      :style="fill"
      @mousedown.prevent="jumpAndStartDragging"
    />
    <div
      ref="cursor"
      :style="{ left: `${percentX}%`, top: `${percentY}%`, background: hsla.toString() }"
      :class="{ dragging: isDragging }"
      @mousedown.prevent="startDragging"
      class="absolute cursor cursor-grab active:cursor-grabbing rounded-full box-content border-4 border-white"
    />
  </div>
</template>

<style scoped lang="scss">
.color {
  .gradient {
    position: relative;
    width: 100%;
    aspect-ratio: 4/2;
    max-height: 200px;
    display: block;
    overflow: hidden;
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
    }
    &::before {
      z-index: 1;
      background: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }
    &::after {
      z-index: 2;
      background: linear-gradient(to bottom, transparent 0%, #000 100%);
    }
  }

  .cursor {
    width: 16px;
    height: 16px;
    top: 50%;
    z-index: 3;

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
