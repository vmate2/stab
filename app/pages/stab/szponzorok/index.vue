<template>
  <div style="overflow: auto;">
    <client-only>
      <custom-table
        v-if="currentUserResolved"
        :tableData="tableData"
        :current-user="currentUserResolved"
        :customButtons="customButtons"
        @modify="handleModify"
        @add="handleAdd"
        @delete="handleDelete"
        @import="handleImport"
        @export="handleExport"
        @button-click="handleButtonClick"
      />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { inject } from 'vue';
import customTable from '~/components/customTable.vue';

const { token }: any = useAuth();
const currentUserResolved = ref<Partial<User> | null>(null);

onMounted(async () => {
  currentUserResolved.value = await User.currentUser(token);
});

const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();


const loading = ref(false);

const layoutData: any = inject('layoutData');
const selectedSponsors = useState('selectedSponsor', () => null)


const sponsors = ref(layoutData.value.sponsors);
selectedSponsors.value = sponsors.value
  .filter(s => s.email) // csak azok, akiknek van emailjük
  .map(s => ({ name: s.name, email: s.email })) // csak name és email

console.log(sponsors.value);

const tableData = ref({
  head: [
    { text: 'Név', value: 'name', center: false},
    { text: 'E-mail', value: 'email' },
    { text: 'Telefonszám', value: 'phone' },
    { text: 'Státusz', value: 'status', center: true},
  ],
  body: sponsors.value
});

const customButtons = ref([
  { name: 'emailmanager', label: 'E-mailek kezelése' }
]);

const handleButtonClick = (type:string) => {
  if (type === 'emailmanager') {
    navigateTo('./szponzorok/mailmanager', )
  }
  
}


const handleModify = async (row: any) => {
  const dialogData = {
    show: true,
    title: 'Szponzor módosítása',
    desc: 'Módosítsd a szponzor adatait.',
    inputs: [
      { label: 'Név', type: 'text', value: row.name, placeholder: 'Szponzor neve' },
      { label: 'E-mail', type: 'text', value: row.email, placeholder: 'Szponzor e-mail címe' },
      { label: 'Telefonszám', type: 'text', value: row.phone, placeholder: 'Szponzor telefonszáma' },
      { label: 'Státusz', type: 'dropdown', value: row.status, dropdownopts: [
        { value: '✔️', default: row.status === '✔️' },
        { value: '❌', default: row.status === '❌' },
        { value: '⏳', default: row.status === '⏳' }
      ] }
    ],
    buttons: [
      { label: 'Módosítás', value: 'modify', color: '#4CAF50', textcolor: '#FFFFFF' },
      { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF' }
    ]
  };
  const dialog = await $showDialog(dialogData);
  console.log(dialog);
  if (dialog.button === 'modify') {
    const updatedSponsor = {
      id: row.id,
      name: dialog.inputs[0]?.value,
      email: dialog.inputs[1]?.value,
      phone: dialog.inputs[2]?.value,
      status: dialog.inputs[3]?.value
    };
    
    loading.value = true;
    const response = await $fetch<any>('/api/sponsors', {
      method: 'PATCH',
      body: updatedSponsor,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      }
    });
    if (response) {
      reloadData();
      $notify(`A(z) ${updatedSponsor.name} szponzor sikeresen módosítva!`, 'success');
    } else {
      $notify('Hiba történt a szponzor módosításakor.', 'error');
    }
    loading.value = false;
  }
  
};

const handleAdd = async () => {
  const dialogData = {
    show: true,
    title: 'Új szponzor hozzáadása',
    desc: 'Add meg az új szponzor adatait.',
    inputs: [
      { label: 'Név', type: 'text', value: '', placeholder: 'Szponzor neve', required: true },
      { label: 'E-mail', type: 'text', value: '', placeholder: 'Szponzor e-mail címe', required: false },
      { label: 'Telefonszám', type: 'text', value: '', placeholder: 'Szponzor telefonszáma', required: false },
      { label: 'Státusz', type: 'dropdown', value: '', dropdownopts: [
        { value: '✔️', default: false },
        { value: '❌', default: true },
        { value: '⏳', default: false }
      ] }
    ],
    buttons: [
      { label: 'Hozzáadás', value: 'add', color: '#4CAF50', textcolor: '#FFFFFF', type: 'submit' },
      { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF' }
    ]
  };
  const dialog = await $showDialog(dialogData);
  console.log(dialog);
  // Check if all fields are filled
  if (dialog.button === 'submit' || dialog.button === 'add') {
    const newSponsor = {
      name: dialog.inputs[0]?.value,
      email: dialog.inputs[1]?.value,
      phone: dialog.inputs[2]?.value,
      status: dialog.inputs[3]?.value
    };
    
    const response = await $fetch<any>('/api/sponsors', {
      method: 'POST',
      body: newSponsor,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      }
    });
    if (response) {
      reloadData();
      $notify(`A(z) ${newSponsor.name} szponzor sikeresen hozzáadva!`, 'success');
    } else {
      $notify('Hiba történt az új szponzor hozzáadásakor.', 'error');
    }
  }


  
};

const reloadData = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/sponsors', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    sponsors.value = response;
    tableData.value.body = sponsors.value;
  } catch (error) {
    $notify('Hiba történt a szponzorok betöltésekor.', 'error');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (row: any) => {
  const dialogData = {
    show: true,
    title: 'Szponzor törlése',
    desc: `Biztosan törölni szeretnéd a(z) ${row.name} szponzort?`,
    buttons: [
      { label: 'Törlés', value: 'delete', color: '#F44336', textcolor: '#FFFFFF' },
      { label: 'Mégse', value: 'cancel', color: '#9E9E9E', textcolor: '#FFFFFF' }
    ]
  };
  const dialog = await $showDialog(dialogData);
  if (dialog.button === 'delete') {
    console.log(JSON.stringify({ id: row.id }));
    
    loading.value = true;
    const response = await $fetch<any>('/api/sponsors', {
      method: 'DELETE',
      body: {id: row.id},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      }
    });
    if (response) {
      reloadData();
      $notify(`A(z) ${row.name} szponzor sikeresen törölve!`, 'success');
    } else {
      $notify('Hiba történt a szponzor törlésekor.', 'error');
    }
    loading.value = false;

    console.log(response);
    
  }
};

const handleImport = async () => {
  const dialogData = {
    show: true,
    title: 'Szponzorok importálása',
    desc: 'Importáld a szponzorokat egy Excel fájlból.',
    inputs: [
      { label: 'Excel fájl', type: 'file', value: '', placeholder: 'Válassz egy Excel fájlt', required: true, accepts: '.xlsx,.xls' }
    ],
    buttons: [
      { label: 'Adatok megtartása', value: 'import', color: '#4CAF50', textcolor: '#FFFFFF' },
      { label: 'Új adatok', value: 'import_new', color: '#2196F3', textcolor: '#FFFFFF' },
      { label: 'Mégse', value: 'cancel', color: '#F44336', textcolor: '#FFFFFF' }
    ]
  };
  const dialog = await $showDialog(dialogData);
  if (dialog.button === 'import' || dialog.button === 'import_new') {
    const file = dialog.inputs[0]?.value;
    if (file && isExcelFile(file)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', dialog.button === 'import' ? 'keep' : 'new');
      console.log(dialog.button === 'import' ? 'keep' : 'new');
      
      
      
      loading.value = true;
      try {
        const response = await $fetch('/api/sponsors/import', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        });
        if (response?.success === true) {
          reloadData();
          $notify('Szponzorok sikeresen importálva!', 'success');
        } else {
          $notify('Hiba történt a szponzorok importálásakor.', 'error');
        }
      } catch (error) {
        $notify('Hiba történt a szponzorok importálásakor.', 'error');
      } finally {
        loading.value = false;
      }
    } else {
      $notify('Kérlek, válassz egy fájlt az importáláshoz.', 'warning');
    }
  } 
  console.log(dialog);
  
};

const handleExport = async () => {
  const response = await fetch('/api/sponsors/export', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
  });

  const blob = await response.blob();
  console.log(blob);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'szponzorok.xlsx';
  a.click();
  URL.revokeObjectURL(url);

  
  // You can now use the blob, e.g., to trigger a file download
};


function isExcelFile(file: File): boolean {
  const excelMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];
  const excelExtensions = ['.xlsx', '.xls'];

  // Check MIME type
  if (excelMimeTypes.includes(file.type)) return true;

  // Check file extension
  const lowerName = file.name.toLowerCase();
  return excelExtensions.some(ext => lowerName.endsWith(ext));
}



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

@media screen and (max-width: 843px) {
  div {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
  }
  
}
</style>

