<template>
  <div>
    <client-only>
      <customTable 
        v-if="currentUserResolved"
        :tableData="tableData" 
        :current-user="currentUserResolved" 
        :customButtons="customButtons" 
        @cell-click="handleCellClick" 
        @buttonClick="handleCustomButtonClick"
        @modify="handleModify"
        @delete="handleDelete"
        @add="handleAdd"
        @import="handleImport"
        @export="handleExport"
      />
    </client-only>
  </div>
  <spinner v-if="loading"></spinner>
</template>


<script lang="ts" setup>
import customTable from '~/components/customTable.vue';
import { ref, onMounted } from 'vue';
const { $notify, $showDialog } = useNuxtApp();
definePageMeta({
  layout: 'new'
});

const loading = ref(false);

const { token }: any = useAuth();
console.log(token);

const currentUserResolved = ref<Partial<User> | null>(null);
onMounted(async () => {
  currentUserResolved.value = await User.currentUser(token);
});

const handleCellClick = (row: any) => {
  console.log('Row clicked:', row);
};

const handleCustomButtonClick = (buttonName:any) => {
  console.log(`Custom button clicked: ${buttonName}`);
  switch (buttonName) {
    case 'editcash':
      handleEditCash();
      break;
    case 'sendemails':
      //handleSendEmails();
      break;
    case 'resetpass':
      handleResetPasswords();
      break;
    default:
      console.log('Unknown button clicked');
      console.error('Unknown button clicked! \n Cannot handle this button click.');
      break;
  }
};

const handleEditCash = async () => {
  const users = layoutData.value.users;

  const inputs = users.map((user:any) => ({
    label: user.name,
    type: 'text',
    value: user.paidcash || 0,
    placeholder: '1000',
    textcolor: '#000'
  }));

  const dialogConfig = {
    title: 'Stábpénz módosítása',
    desc: 'Adja meg az új stábpénz értékeket a felhasználók számára.',
    inputs,
    buttons: [
      { label: 'Mégse', value: 'cancel', color: '#f00', textcolor: '#fff' },
      { label: 'Mentés', value: 'save', color: '#0f0', textcolor: '#000' }
    ]
  };

  const result = await $showDialog(dialogConfig);
  console.log(result.button);
  try {
    if (result.button === 'save') {
    let modifiedUsers = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userpaidcash = parseInt(user.paidcash || '0');
      const newValue = parseInt(result.inputs[i]?.value || '0');
      
      if (newValue !== userpaidcash) {
        modifiedUsers.push({
          uuid: user.uuid,
          paidcash: newValue
        });
      }
      else {
        continue;
      }
      
      //// send the modified users to the server

      const { data, error, status } = await useFetch(`/api/users/modifycash`, {
        method: 'PATCH',
        body: {
          uuid: user.uuid,
          amount: newValue,
          type: 'stabcashChange',
        },
        headers: {
          'authorization': `Bearer ${token.value}`
        },
      });

      if (error.value) {
        $notify('Hiba történt a mentés során!', 'error');
        console.error(error.value);
        return;
      }
      if (data.value) {
        console.log('Sikeres módosítás:', data.value);
        console.log('Modified user:', user.name, 'from', userpaidcash, 'to', newValue);
        
        log.modification({
          title: 'Stabcash change',
          type: 'cashchange',
          data: {
            from: userpaidcash,
            to: newValue,
            onUser: user.name,
          }
        });
      } else {
        $notify('Hiba történt a mentés során!', 'error');
        return;
      }
      

    }
    reloadData();
    $notify('Sikeres módosítás', 'success');
    
  } else {
    console.log('Edit canceled');
  }
  } catch (error) {
    console.error('Error during edit cash:', error);
    $notify('Hiba történt a módosítás során!', 'error');
  }
  
};

const handleModify = async (row: any) => {
  const response = await $showDialog({title: 'Felhasználó módosítása', desc: '', buttons: [{label: 'Mégse', value: 'Cancel', color: '#007bff', textcolor: '#FFFFFF'}, {label: 'OK', value: 'OK', color: '#adadad', textcolor: '#000000'}], inputs: [{ label: 'Név', type: 'text', placeholder: 'Lakatos Krizsantén', value: row.name }, { label: 'e-mail', type: 'text', placeholder: 'diakonkormanyzat@taszi.hu', value: row.email }, { label: 'Telefonszám', type: 'text', placeholder: '+36309112025', value: row.phone }, { label: 'Pozíció', type: 'dropdown', dropdownopts: [{value: 'stábtag', default: true}, {value: 'kisfőnök', default: false}, {value: 'kampányfőnök', default: false}, {value: 'jelölt', default: false}] }] });

  if (response.button === 'OK') {
    const [name, email, phone, post] = response.inputs.map(i => i?.value?.trim());

    if (!name || !email || !phone || !post) {
      $notify('Kérlek töltsd ki az összes mezőt!', 'error');
      return;
    }

    if (!['stábtag', 'kampányfőnök', 'kisfőnök', 'jelölt'].includes(post.toLowerCase())) {
      $notify('Kérlek helyesen add meg a pozíciót!', 'error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(?:\+36|06)(?:20|30|31|50|70)[0-9]{7}$/;

    if (!emailRegex.test(email) || !phoneRegex.test(phone)) {
      $notify('Kérlek helyesen add meg az e-mail címet és telefonszámot!', 'error');
      return;
    }

    const { data, error, status } = await useFetch(`/api/users/stabtag/`, {
      method: 'PATCH',
      body: {
        name,
        email,
        phone,
        post,
        uuid: row.uuid
      },
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });

    if (error.value) {
      $notify('Hiba történt a mentés során!', 'error');
      console.error(error.value);
      return;
    }

    if (data.value) {
      console.log('Sikeres módosítás:', data.value);
    } else {
      $notify('Hiba történt a mentés során!', 'error');
      return;
    }

    $notify('Sikeres módosítás', 'success');
    reloadData();
  }
};

const handleAdd = async () => {
 const response = await $showDialog({title: 'Új felhasználó', desc: '', buttons: [{label: 'Mégse', value: 'Cancel', color: '#007bff', textcolor: '#FFFFFF'}, {label: 'OK', value: 'OK', color: '#adadad', textcolor: '#000000'}], inputs: [{ label: 'Név', type: 'text', placeholder: 'Lakatos Krizsantén' }, { label: 'e-mail', type: 'text', placeholder: 'diakonkormanyzat@taszi.hu' }, { label: 'Telefonszám', type: 'text', placeholder: '06308882222' }, { label: 'Pozíció', type: 'dropdown', dropdownopts: [{value: 'stábtag', default: true}, {value: 'kisfőnök', default: false}, {value: 'kampányfőnök', default: false}, {value: 'jelölt', default: false}] }] });
  loading.value = true;

  if (response.button === 'OK') {
    const [name, email, phone, post] = response.inputs.map(i => i?.value?.trim());

    if (!name || !email || !phone || !post) {
      $notify('Kérlek töltsd ki az összes mezőt!', 'error');
      loading.value = false;
      return;
    }

    if (!['stábtag', 'kisfőnök', 'kampányfőnök', 'jelölt'].includes(post.toLowerCase())) {
      $notify('Kérlek helyesen add meg a pozíciót!', 'error');
      loading.value = false;
      return;
    }



    if (!emailRegex.test(email) || !phoneRegex.test(phone)) {
      $notify('Kérlek helyesen add meg az e-mail címet és telefonszámot!', 'error');
      loading.value = false;
      return;
    }

    const { data, error, status } = await useFetch(`/api/users/createNew`, {
      method: 'POST',
      body: {
        name,
        email,
        phone,
        post
      },
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });

    if (error.value) {
      $notify('Hiba történt a mentés során!', 'error');
      console.error(error.value);
      loading.value = false;
      return;
    }

    if (data.value) {
      console.log('Sikeres létrehozás:', data.value);
    } else {
      $notify('Hiba történt a mentés során!', 'error');
      loading.value = false;
      return;
    }
    loading.value = false;
    $notify('Sikeres létrehozás', 'success');
    reloadData();
  } else {
    loading.value = false;
  }
}



const handleImport = (row: any) => {
  console.log('Import clicked:', row);
};

const handleExport = (row: any) => {
  console.log('Export clicked:', row);
};


async function reloadData() {
  const { data, error } = await useFetch(`/api/`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token.value}`
    }
  });

  console.log('RESPONSE:', data.value);
  

  if (error.value) {
    $notify('Hiba történt az adatok frissítésekor!', 'error');
    console.error(error.value);
    return;
  }

  if (data.value) {
    layoutData.value.users = data.value.users;
    tableData.value.body = layoutData.value.users.map((user: any) => ({
      ...user,
      paidcash: {
        value: `${user.paidcash ?? 0} ft`,
        bgColor: (user.paidcash ?? 0) >= 15000 ? 'green' : 'red'
      }
    }));
    console.log('Adatok frissítve:', tableData.value.body);
    
  }
}



const layoutData: any = inject('layoutData');
console.log(layoutData.value.users);

const tableData = ref({
  head: [
    { text: 'Név', value: 'name' },
    { text: 'E-mail', value: 'email' },
    { text: 'Telefonszám', value: 'phone' },
    { text: 'Pozíció', value: 'post' },
    { text: 'Fizetett stabcash', value: 'paidcash' },
    { text: 'Iskola', value: 'school' },
    { text: 'Város', value: 'city' },
  ],
  body: layoutData.value.users.map((user: any) => ({
    ...user,
    paidcash: {
      value: `${user.paidcash ?? 0} ft`,
      bgColor: (user.paidcash ?? 0) >= 15000 ? 'green' : 'red'
    }
  }))
});

console.log(tableData.value.body);




const customButtons = ref([
  { name: 'editcash', label: 'Stabcash módosítása' },
  { name: 'sendemails', label: 'Köremail küldése' },
  { name: 'resetpass', label: 'Jelszó visszaállítása'}
]);

const handleDelete = async (row: any) => {
  const response = await $showDialog({
    title: 'Felhasználó törlése',
    desc: `Biztosan törölni szeretnéd ${row.name} felhasználót?`,
    buttons:  [{label: 'Nem', value: 'false', color: '#007bff', textcolor: '#FFFFFF'}, {label: 'Igen', value: 'true', color: '#adadad', textcolor: '#000000'}]
  });

  if (response.button === 'true') {
    loading.value = true;
    const { data, error, status } = await useFetch(`/api/users/`, {
      method: 'DELETE',
      body: {
        uuid: row.uuid
      },
      headers: {
        'authorization': `Bearer ${token.value}`
      }
    });

    if (error.value) {
      $notify('Hiba történt a törlés során!', 'error');
      console.error(error.value);
      loading.value = false;
      return;
    }

    if (data.value?.result1 && data.value?.result2) {
      console.log('Sikeres törlés:', data.value);
    } else {
      $notify('Hiba történt a törlés során!', 'error');
      loading.value = false;
      return;
    }
    loading.value = false;
    reloadData();
    $notify('Sikeres törlés', 'success');
  }
};

const handleResetPasswords = async () => {
  const users = layoutData.value.users;

  

  let inputs = users.map((user: any) => ({
    label: user.name,
    type: 'text',
    placeholder: 'Új jelszó',
    value: '',
    textcolor: '#000'
  }));

  while (true) {
    const result = await $showDialog({
      title: 'Jelszavak visszaállítása',
      desc: 'Add meg az új jelszavakat az egyes felhasználókhoz!',
      inputs,
      buttons: [
        { label: 'Mégse', value: 'cancel', color: '#f00', textcolor: '#fff' },
        { label: 'Mentés', value: 'save', color: '#0f0', textcolor: '#000' }
      ]
    });

    if (result.button !== 'save') {
      console.log('Password reset canceled.');
      return;
    }

    let valid = true;
    const invalidIndices: number[] = [];

    for (let i = 0; i < result.inputs.length; i++) {
      const value = result.inputs[i]?.value?.trim();
      console.log(value);
      
      if (value && !passwordRegex.test(value) && value !== '') {
        inputs[i].color = '#f00'; // Megjelölés pirossal
        inputs[i].value = value;
        invalidIndices.push(i);
        console.log(invalidIndices);
        
        valid = false;
      } else {
        inputs[i].color = '#000'; // Reset szín, ha érvényes
      }
    }

    if (!valid) {
      $notify('Hibás jelszavak! Legalább 8 karakter, 1 nagybetű és 1 szimbólum szükséges.', 'error');
      continue; // újradialóg
    }

    // Minden jelszó valid
    for (let i = 0; i < users.length; i++) {
      const newPass = result.inputs[i]?.value?.trim();
      if (!newPass) continue;

      const { data, error } = await useFetch('/api/users/resetpass', {
        method: 'PATCH',
        body: {
          name: users[i].name,
          email: users[i].email,
          uuid: users[i].uuid,
          password: newPass
        },
        headers: {
          authorization: `Bearer ${token.value}`
        }
      });

      if (error.value) {
        $notify(`Hiba történt ${users[i].name} jelszavának módosításakor`, 'error');
        console.error(error.value);
        return;
      }

      console.log(`Jelszó módosítva: ${users[i].name}`);
      if (data.value) {
      console.log('modosított jelszo:', data.value)
      }

      log.modification({
        title: 'Password reset',
        type: 'password',
        data: {
          user: users[i].name
        }
      });
    }

    $notify('Sikeres jelszó visszaállítás', 'success');
    break;
  }
};


</script>

<style scoped>

div {
  height: 100vh;
  width: 90%;
  justify-self: center;
}
</style>

