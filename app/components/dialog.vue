<template>
  <div v-if="dialog.show" class="dialog-overlay">
    <div class="dialog-container" :class="{appear: dialogAnimation == 'appear', disappear: dialogAnimation == 'disappear'}" ref="dialogContainer">
      <div class="dialog-content">
        <h3>{{ dialog.title }}</h3>
        <p>{{ dialog.desc }}</p>
        <form
          v-if="dialog.inputs"
          class="dialog-inputs"
          @submit.prevent="handleSubmit"
          ref="formEl"
        >
          <div v-for="(input, index) in dialog.inputs" :key="index" class="dialog-input-group">
            <label :for="'input-' + index">{{ input.label }}</label>

            <template v-if="input.type === 'text'">
              <input v-model="input.value" :placeholder="input.placeholder" :id="'input-' + index" type="text" class="dialog-input" :required="input.required" />
            </template>
            <template v-if="input.type === 'email'">
              <input v-model="input.value" :placeholder="input.placeholder" :id="'input-' + index" type="email" class="dialog-input" :required="input.required" />
            </template>

            <template v-else-if="input.type === 'dropdown'">
              <select v-model="input.value" :id="'input-' + index" class="dialog-input" :required="input.required">
                <option v-for="option in input.dropdownopts" :key="option.value" :value="option.value">
                  {{ option.value }}
                </option>
              </select>
            </template>

            <template v-if="input.type === 'file'">
              <input :required="input.required" type="file" :id="'input-' + index" class="dialog-input" @change="(e) => input.value = e.target.files ? e.target.files[0] : null" :accept="input.accepts" />
            </template>
          </div>

          <div class="dialog-buttons">
            <button
              v-for="(button, index) in dialog.buttons"
              :key="index"
              :type="button.type || 'button'"
              :style="{ backgroundColor: button.color, color: button.textcolor }"
              @click="button.type !== 'submit' && handleButtonClick(button.value)"
            >
              {{ button.label }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';

const dialogContainer = ref<HTMLElement | null>(null);
const dialogAnimation = ref('appear');

const formEl = ref<HTMLFormElement | null>(null);

function handleSubmit(event: SubmitEvent) {
  const submitter = event.submitter as HTMLButtonElement | null;
  const value = submitter?.value || 'submit';

  // csak akkor hívjuk meg, ha a form valid
  if (formEl.value?.checkValidity()) {
    handleButtonClick(value);
  } else {
    // trigger native form hibajelzést
    formEl.value?.reportValidity();
  }
}

const dialog = useState<{
  show: boolean;
  title: string;
  desc: string;
  inputs: Array<{
    label: string;
    type: string;
    placeholder?: string;
    dropdownopts?: Array<{ value: string; default: boolean }>;
    value?: any;
    required?: boolean;
    accepts?: string; // for file inputs
  }>;
  buttons: Array<{
    label: string;
    value: string;
    color?: string;
    textcolor?: string;
    type?: 'submit' | 'button' | 'reset';
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
  // Remove any animation class before triggering disappear
  console.log(buttonValue);
  
  dialogAnimation.value = '';
  void dialogContainer.value?.offsetWidth;
  dialogAnimation.value = 'disappear';
  setTimeout(() => {
    dialog.value.show = false;
    dialog.value.resolve?.({ button: buttonValue, inputs: dialog.value.inputs || [] });
    dialog.value = { show: false, title: '', desc: '', buttons: [], inputs: [] };
    dialogAnimation.value = ''; // reset for next open
  }, 300); // match the .disappear animation duration
};

watch(
  () => dialog.value.show,
  (show, prevShow) => {
    if (show && !prevShow) {
      dialogAnimation.value = 'appear';
      setTimeout(() => {
        dialogAnimation.value = '';
      }, 300);
    }
  }
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

.appear {
  animation: appear 0.3s ease-in-out;
}

.disappear {
  animation: appear 0.3s ease-in-out reverse;
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


@keyframes appear {
  from {
    opacity: 0;
    scale: 0.8;
    transform: translateY(-20px);
    rotate: 30deg;
  }
  to {
    opacity: 1;
    scale: 1;
    transform: translateY(0);
    rotate: 0deg;
  }
  
}
</style>