<script setup>
// Import the Digit and LCD classes from the /src/assets/lcd.mjs module
import { Digit } from '../assets/lcd.mjs';
import { defineProps, ref } from 'vue';
import { defineEmits } from 'vue';
import { computed } from 'vue';

// Accept a digit object as a required prop
const props = defineProps({
  digit: {
    type: Digit,
    required: true,
  },
  differentiate: {
    type: Boolean,
    default: false,
  },
});

// Create a handler for when a digit segment is clicked
const emit = defineEmits(['segmentClick']);
const handleSegmentClick = (segmentIndex) => {
  // Get the value of the digit property
  const digit = props.digit;
  // Emit the segmentClick event with the segment index
  if (digit.possibleShape.has(segmentIndex)) {
    digit.possibleShape.delete(segmentIndex);
  } else {
    digit.possibleShape.add(segmentIndex);
  }

  emit('segmentClick', segmentIndex);
};

// Create a computed property to determine the broken segment color
const offSegmentColor = ref('rgb(128 128 128 / 25%)');
const brokenSegmentColor = computed(() => {
  return props.differentiate ? 'red' : offSegmentColor.value;
});
</script>

<template>
    <!-- Render the digit object -->
    <div class="digit">
        <span
            class="segment segment-0"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(0),
                'segment-on': digit.possibleShape.has(0),
            }"
            @click="handleSegmentClick(0)"
        ></span><!-- top segment -->
        <span
            class="segment segment-1"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(1),
                'segment-on': digit.possibleShape.has(1),
            }"
            @click="handleSegmentClick(1)"
        ></span><!-- top-left segment -->
        <span
            class="segment segment-2"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(2),
                'segment-on': digit.possibleShape.has(2),
            }"
            @click="handleSegmentClick(2)"
        ></span><!-- top-right segment -->
        <span
            class="segment segment-3"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(3),
                'segment-on': digit.possibleShape.has(3),
            }"
            @click="handleSegmentClick(3)"
        ></span><!-- middle segment -->
        <span
            class="segment segment-4"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(4),
                'segment-on': digit.possibleShape.has(4),
            }"
            @click="handleSegmentClick(4)"
        ></span><!-- bottom-left segment -->
        <span
            class="segment segment-5"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(5),
                'segment-on': digit.possibleShape.has(5),
            }"
            @click="handleSegmentClick(5)"
        ></span><!-- bottom-right segment -->
        <span
            class="segment segment-6"
            :class="{ 
                'segment-broken': digit.brokenSegments.has(6),
                'segment-on': digit.possibleShape.has(6),
            }"
            @click="handleSegmentClick(6)"
        ></span><!-- bottom segment -->
    </div>
</template>

<style scoped>
.digit {
    position: relative;
    width: 50px;
    height: 100px;
    margin: 10px;
    --segment-weight: 10px;
}

@media (width < 60em) {
    .digit {
        width: 25px;
        height: 50px;
        margin: 5px;
        --segment-weight: 5px;
    }
}

.segment {
    display: block;
    position: absolute;
    background-color: v-bind(offSegmentColor);
    border-radius: 5px;
    transition: background-color 0.1s ease;
    cursor: pointer;
}
.segment-on {
    background-color: light-dark(#222, #eee);
}
.segment-broken {
    background-color: v-bind(brokenSegmentColor);
}

.segment-0 {
    top: 0;
    left: var(--segment-weight);
    width: calc(100% - var(--segment-weight) * 2);
    height: var(--segment-weight);
}
.segment-1 {
    top: var(--segment-weight);
    left: 0;
    width: var(--segment-weight);
    height: calc(50% - var(--segment-weight) * 1.5);
}
.segment-2 {
    top: var(--segment-weight);
    right: 0;
    width: var(--segment-weight);
    height: calc(50% - var(--segment-weight) * 1.5);
}
.segment-3 {
    top: 50%;
    left: var(--segment-weight);
    width: calc(100% - var(--segment-weight) * 2);
    height: var(--segment-weight);
    transform: translateY(-50%);
}
.segment-4 {
    bottom: var(--segment-weight);
    left: 0;
    width: var(--segment-weight);
    height: calc(50% - var(--segment-weight) * 1.5);
}
.segment-5 {
    bottom: var(--segment-weight);
    right: 0;
    width: var(--segment-weight);
    height: calc(50% - var(--segment-weight) * 1.5);
}
.segment-6 {
    bottom: 0;
    left: var(--segment-weight);
    width: calc(100% - var(--segment-weight) * 2);
    height: var(--segment-weight);
}
</style>