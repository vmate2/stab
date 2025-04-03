<template>
  <main-frame id="frameProfile" v-show="data">
    <div class="frameProfile" >
    </div>
  </main-frame>
  <spinner v-show="!data"></spinner>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'profile'
});
const { $notify, $showDialog } = useNuxtApp();

const data = ref(await inject('currentUser')) ;

console.log(data.value);


</script>

<style scoped>

</style>