<template>
  <main-frame id="frameProfile" v-show="data">
    <div class="frameProfile" >
      <div @click="fetchData">asd</div>
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

console.log(data.value.accessToken);

const result = ref();

  const fetchData = async () => {
    console.log('Doing some');
    
    result.value = await $fetch('/api/verifyJWT', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${data.value.accessToken}`
      }
    })
    console.log(result.value);
    
  }

</script>

<style scoped>

</style>