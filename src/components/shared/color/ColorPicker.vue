<script setup lang="ts">
import { computed } from 'vue';

import RangePicker from '@/components/shared/color/RangePicker.vue';
import AlphaPicker from '@/components/shared/color/AlphaPicker.vue';
import RectanglePicker from '@/components/shared/color/RectanglePicker.vue';

import { fromString } from '@/support/color/Factory';
import { Color, ColorFormat } from '@/support/color/Color';
import HSLAColor from '@/support/color/HSLAColor';
import HEXColor from '@/support/color/HEXColor';

interface Props {
  modelValue: string;
  presets?: string[];
  showPresets?: boolean;
  inline: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  presets: () => [
    'transparent',
    '#FFFFFF',
    '#000000',
    '#82589F',
    '#D6A2E8',
    '#BDC581',
    '#FC427B',
    '#FD7272',
    '#182C61',
    '#3B3B98',
    '#6D214F',
    '#B33771'
  ],
  showPresets: true
});
const emit = defineEmits(['update:modelValue']);

const model = computed((): Color => {
  try {
    return fromString(props.modelValue);
  } catch (e) {
    return new HEXColor(0, 0, 0);
  }
});

const hsla = computed((): HSLAColor => model.value.to(ColorFormat.HSLA) as HSLAColor);

const alpha = computed({
  get(): number {
    // get alpha from rgba
    return hsla.value.alpha;
  },
  set(value: number) {
    setColor(hsla.value.addAlpha(value).to(model.value.format).toString());
  }
});

const hue = computed({
  get(): number {
    return hsla.value.hue;
  },
  set(value: number) {
    hsla.value.hue = value;
    if (hsla.value.alpha === 0) {
      hsla.value.alpha = 1;
    }

    setColor(hsla.value.to(model.value.format).toString());
  }
});

const rectanglePicked = (saturation: number, lightness: number) => {
  hsla.value.saturation = saturation;
  hsla.value.lightness = lightness;

  if (hsla.value.alpha === 0) {
    hsla.value.alpha = 1;
  }

  setColor(hsla.value.to(model.value.format).toString());
};

const setColor = (color: string) => {
  if (color === props.modelValue) {
    return;
  }
  setTimeout(() => emit('update:modelValue', color));
};
</script>

<template>
  <div
    class="picker flex flex-col gap-6 w-full"
    :class="{ 'bg-white dark:bg-zinc-900 shadow-lg': !inline }"
  >
    <ul v-if="showPresets" class="flex gap-2">
      <li
        v-for="preset in presets"
        :key="preset"
        :style="{ backgroundColor: preset }"
        :class="{ transparent: preset === 'transparent' }"
        @click.prevent="setColor(preset)"
        class="picker-color w-full aspect-square rounded-md cursor-pointer shadow-md dark:ring dark:ring-inset dark:ring-zinc-900"
      />
    </ul>

    <RectanglePicker :hsla="hsla" @change="rectanglePicked" />
    <RangePicker v-model="hue" />
    <AlphaPicker v-model="alpha" :start-color="model" />
  </div>
</template>

<style scoped lang="scss">
.picker {
  min-width: 340px;
  .transparent {
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
  }

  .picker-color {
    transition: transform 0.2s ease-in-out;
    max-width: 32px;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
