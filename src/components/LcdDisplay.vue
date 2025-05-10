<script setup>
import { LCD } from '../assets/lcd.mjs';
import DigitDisplay from './DigitDisplay.vue';
import { defineProps } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps({
  lcd: {
    type: LCD,
    required: true,
  },
  differentiate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['segmentClick']);
</script>

<template>
  <div class="lcd">
    <digit-display
      v-for="(digit, index) in lcd.digits"
      :key="index"
      :digit="digit"
      :differentiate="differentiate"
      @segmentClick="(segmentIndex) => emit('segmentClick', { digitIndex: index, segmentIndex })"
    ></digit-display>
  </div>
</template>

<style scoped>
  .lcd {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
