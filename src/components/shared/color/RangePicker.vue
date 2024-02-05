<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get(): number {
    return props.modelValue
  },
  set(value: number) {
    if (value === props.modelValue) {
      return
    }
    return emit('update:modelValue', value)
  }
})

const color = computed(() => {
  const h = model.value
  const s = 100
  const l = 50
  return `hsl(${h}, ${s}%, ${l}%)`
})

const hueElement = ref<HTMLCanvasElement>()
const percent = ref(0)
const isDragging = ref(false)

const startDragging = () => {
  isDragging.value = true

  window.addEventListener('mousemove', drag)
  window.addEventListener('mouseup', stopDragging)
}

const drag = (e: MouseEvent) => {
  const { left, width } = hueElement.value!.getBoundingClientRect()
  const x = e.clientX - left
  percent.value = Math.min(100, Math.max(0, (x / width) * 100))

  getColorUnderCursor()
}

const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDragging)
}

const jumpAndStartDragging = (e: MouseEvent) => {
  drag(e)
  startDragging()
}

const getColorUnderCursor = () => {
  model.value = 360 - (360 * percent.value) / 100
}

const percentFromHue = () => {
  percent.value = 100 - (model.value / 360) * 100
}

watch(() => model.value, percentFromHue)

onMounted(() => {
  percentFromHue()
})
</script>

<template>
  <div ref="hueElement" class="range relative select-none">
    <div class="gradient rounded-md cursor-pointer" @mousedown.prevent="jumpAndStartDragging" />
    <div
      ref="cursor"
      :style="{ left: `${percent}%`, background: color }"
      @mousedown.prevent="startDragging"
      :class="{ dragging: isDragging }"
      class="absolute cursor cursor-grab active:cursor-grabbing rounded-full box-content border-4 border-white"
    />
  </div>
</template>

<style scoped lang="scss">
.range {
  .gradient {
    width: 100%;
    height: 12px;
    display: block;
    background: linear-gradient(
      to left,
      rgb(255, 0, 0),
      rgb(255, 255, 0),
      rgb(0, 255, 0),
      rgb(0, 255, 255),
      rgb(0, 0, 255),
      rgb(255, 0, 255),
      rgb(255, 0, 0)
    );
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
