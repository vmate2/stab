<template>
  <main-frame id="frame">
    <div class="frame">
      <label class="marginTop lbl">Név</label>
      <div class="text">{{ user.name }}</div>
      <label class="marginTop lbl">Iskola</label>
      <div class="text">{{ user.school }}</div>
      <label class="marginTop lbl">Fizetett stábpénz</label>
      <div class="text">{{ user.paidcash}}</div>
      <label class="marginTop lbl">Saját azonosító</label>
      <div class="text">{{ user.uuid }}</div>
    </div>
  </main-frame>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'profile'
});

const user = {
  name: 'Varga Máté',
  school: 'Trefort',
  paidcash: '2000Ft',
  uuid: 'asf3543-234sdf-424s'
}
</script>

<style scoped>

#frame {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame {
  background-color: var(--background-primary-color);
  min-width: 400px;
  width: 50%;
  height: 80%;
  border: var(--border);
  border-radius: var(--border-radius-outer);
  display: flex;
  align-items: center ;
  flex-direction: column;
}

@media (max-width: 768px) {
  /* Styles for phones */
  .frame {
    width: 90%;
    min-width: 20px;
  }
}

body {
  overflow: hidden;
}


</style>