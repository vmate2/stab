<template>
  <div v-if="dialog.show" class="dialog-overlay">
    <div class="dialog-container">
      <div class="dialog-content">
        <h3>{{ dialog.title }}</h3>
        <p>{{ dialog.desc }}</p>
        <div v-if="dialog.inputs" class="dialog-inputs">
          <div v-for="(input, index) in dialog.inputs" :key="index" class="dialog-input-group">
            <label :for="'input-' + index">{{ input.label }}</label>
            <template v-if="input.type === 'text'">
              <input v-model="input.value" :placeholder="input.placeholder" :id="'input-' + index" type="text" class="dialog-input" />
            </template>
            <template v-else-if="input.type === 'dropdown'">
              <select v-model="input.value" :id="'input-' + index" class="dialog-input">
                <option v-for="option in input.dropdownopts" :key="option.value" :value="option.value" :default="option.default">
                  {{ option.value }}
                </option>
              </select>
            </template>
          </div>
        </div>
        <div class="dialog-buttons">
          <button v-for="(button, index) in dialog.buttons" :key="index" @click="handleButtonClick(button.value)" :style="{ backgroundColor: button.color, color: button.textcolor }">
            {{ button.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const dialog = useState<{
  show: boolean;
  title: string;
  desc: string;
  inputs: Array<{
    label: string;
    type: string;
    placeholder?: string;
    dropdownopts?: Array<{ value: string; default: boolean }>;
    value?: string;
  }>;
  buttons: Array<{
    label: string;
    value: string;
    color?: string;
    textcolor?: string;
  }>;
  resolve?: (value: any) => void;
}>('dialog', () => ({
  show: false,
  title: '',
  desc: '',
  inputs: [],
  buttons: []
}));

const handleButtonClick = (buttonValue: string) => {
  dialog.value.show = false;
  dialog.value.resolve?.({ button: buttonValue, inputs: dialog.value.inputs || [] });
  dialog.value = { show: false, title: '', desc: '', buttons: [], inputs: [] };
};

watch(
  () => dialog.value,
  (newDialog) => {
    if (newDialog.title) {
      dialog.value.show = true;
    }
  },
  { deep: true }
);
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-container {
  background: #333;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 80%;
  max-width: 600px;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dialog-content h3 {
  font-size: 2rem;
  color: #fff;
}

.dialog-content p {
  font-size: 1.2rem;
  color: #ccc;
}

.dialog-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-input-group label {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.dialog-input-group {
  display: flex;
  flex-direction: column;
}

.dialog-input {
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 5px;
  background: #444;
  color: #fff;
  font-size: 1rem;
}

.dialog-input:focus {
  outline: none;
  border-color: #007bff;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.dialog-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.dialog-buttons button:hover {
  background: #0056b3;
}
</style>