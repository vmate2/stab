<template>
  <div>
    <customTable 
      :tableData="tableData" 
      :current-user="currentUser" 
      :customButtons="customButtons" 
      @cell-click="handleCellClick" 
      @buttonClick="handleCustomButtonClick"
      @modify="handleModify"
      @delete=""
      @add=""

    ></customTable>
  </div>
</template>

<script lang="ts" setup>
import customTable from '~/components/customTable.vue';

definePageMeta({
  layout: 'new'
});

const tableData = ref({
  head: [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Actions', value: 'actions' }
  ],
  body: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', actions: 'lol' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', actions: 'brzj' }
  ]
});

const customButtons = ref([
  { name: 'custom1', label: 'Custom Button 1' },
  { name: 'custom2', label: 'Custom Button 2' },
  { name: 'custom3', label: 'Custom Button 3' }
]);

const handleCellClick = (row: any) => {
  console.log('Row clicked:', row);
};

const handleCustomButtonClick = (buttonName:any) => {
  console.log(`Custom button clicked: ${buttonName}`);
};

const handleModify = (row: any) => {
  console.log('Modify clicked:', row);
};

const handleImport = (row: any) => {
  console.log('Import clicked:', row);
};

const handleExport = (row: any) => {
  console.log('Export clicked:', row);
};


const { token } = useAuth();
console.log(token);

const currentUser = ref(
  User.currentUser(token)
)

</script>

<style>

</style>