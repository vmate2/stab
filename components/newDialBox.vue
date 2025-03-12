<template>
    <div class="NewDialogBoxcontainer">
      <div class="dialog-title">{{ title }}</div>
      <div class="dialog-content">{{ content }}</div>
  
      <!-- Dynamically render the buttons if options are provided -->
      <div v-if="options && options.length" class="button-container">
        <button
          v-for="(option, index) in options"
          :key="index"
          @click="handleOptionClick(option)"
        >
          {{ option }}
        </button>
      </div>
  
      <!-- Single button style when only one button is provided -->
      <button v-else @click="close" class="single-button">{{ buttonText }}</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: String,
    content: String,
    buttonText: String,
    options: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['close', 'option']);
  
  const handleOptionClick = (option: string) => {
    emit('option', option);
    emit('close');
  };
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .NewDialogBoxcontainer {
    width: 30%;
    min-height: 200px;
    height: fit-content;
    background-color: #333333;
    border: solid 2px black;
    border-radius: 14px;
    box-shadow: 2px 2px 15px 5px rgba(0, 0, 0, 0.4);
    color: #ebebeb;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    padding: 1%;
    min-width: 400px;
  }
  
  .NewDialogBoxcontainer .dialog-title {
    font-size: 2rem;
    font-family: 'Poppins', sans-serif;
    text-shadow: 2px 2px black;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .NewDialogBoxcontainer .dialog-content {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 700;
    text-align: justify;
    text-shadow: 1px 1px black;
    margin-bottom: 20px;
    padding: 0 10px;
  }
  
  .NewDialogBoxcontainer .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  
  .NewDialogBoxcontainer .button-container button,
  .NewDialogBoxcontainer .single-button {
    background-color: #444;
    width: 40%;
    min-height: 30px;
    max-height: 40px;
    text-align: center;
    font-size: 1rem;
    color: #ebebeb;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .NewDialogBoxcontainer .button-container button:hover,
  .NewDialogBoxcontainer .single-button:hover {
    background-color: #555;
    transform: scale(1.05);
  }
  
  .NewDialogBoxcontainer .button-container button:active,
  .NewDialogBoxcontainer .single-button:active {
    background-color: #666;
    transform: scale(1);
  }
  </style>
  