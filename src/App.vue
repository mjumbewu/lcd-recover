<script setup>
import LcdDisplay from './components/LcdDisplay.vue';
import { LCD, Digit } from './assets/lcd.mjs';
import { computed, reactive, ref } from 'vue';

let lcd = ref(new LCD([
    reactive(new Digit([])),
    reactive(new Digit([2, 5])),
    reactive(new Digit([1, 4])),
    reactive(new Digit([0, 2, 5])),
    reactive(new Digit([0, 1, 4, 6])),
    reactive(new Digit([])),
]));

let differentiate = ref(false);
let tried = ref(new Set())
let seen = ref('');

const handleSeenChange = () => {
    lcd.value.iSee(seen.value);
    tried.value.clear();
};

const alternatives = computed(() => {
    return lcd.value.alsoCouldBe();
});


const handleAlternativeClick = (value) => {
    // Copy the value to the clipboard
    navigator.clipboard.writeText(value).then(() => {
        console.log('Copied to clipboard:', value);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });

    // Add the value to the tried set
    tried.value.add(value);
}

const handleSegmentClick = () => {
    tried.value.clear();
    console.log('Segment clicked');
}
</script>

<template>
    <div id="app">
        <h1>LCD Recover</h1>
        <label>
            Enter the partial digits you see on the LCD:
            <input 
                type="text" 
                v-model="seen" 
                placeholder="Enter seen digits"
                @input="handleSeenChange"
            />
        </label>
        
        <label>
            <input
                type="checkbox"
                v-model="differentiate"
            />
            Differentiate between off and broken segments
        </label>
        
        <lcd-display :lcd="lcd" :differentiate="differentiate" @segmentClick="handleSegmentClick" />
        
        <div class="alternatives-wrapper">
            <h2>Alternatives</h2>
            <p>These are the <strong>{{alternatives.length}}</strong> numbers that could be displayed (click to copy):</p>
            <ul class="alternatives">
                <li 
                    v-for="value in alternatives" 
                    :key="value" 
                    class="alternative"
                    :class="{ 'tried': tried.has(value) }"
                    @click="handleAlternativeClick(value)">
                    {{ value }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
label {
    display: block;
    margin-bottom: 1rem;
}

.alternatives {
    list-style-type: none;
    padding: 0;
}

.alternative {
    position: relative;
}

.alternative:after {
    position: absolute;
    right: 0;
    content: ' ';
    transition: opacity 1.5s;
    opacity: 1;
}

.tried {
    text-decoration: line-through;
}

.tried:after {
    content: 'Copied!';
    color: green;
    opacity: 0;
}
</style>
