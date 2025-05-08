<template>
  <div>
    <custom-table
      :tableData="tableData"
      :current-user="currentUser"
      :customButtons="customButtons"
    ></custom-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { inject } from 'vue';
import customTable from '~/components/customTable.vue';

const { token }: any = useAuth();

const currentUser = ref(
  User.currentUser(token)
)



const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();

const loading = ref(false);

const layoutData: any = inject('layoutData');

const sponsors = ref(layoutData.value.sponsors);
console.log(sponsors.value);


const tableData = ref({
  head: [
    { text: 'Név', value: 'name' },
    { text: 'E-mail', value: 'email' },
    { text: 'Telefonszám', value: 'phone' },
    { text: 'Státusz', value: 'status' },
  ],
  body: sponsors.value
});



const customButtons = ref([
]);


definePageMeta({
  layout: 'new',
});






</script>

<style scoped>
div {
  height: 100vh;
  width: 90%;
  justify-self: center;
}
</style>

