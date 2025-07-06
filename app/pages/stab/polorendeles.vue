<template>
  <client-only>
    <custom-table
    v-if="currentUserResolved"
    :current-user="currentUserResolved"
    :table-data="tableData"
    @add="handleAdd"
    @modify="handleModify"
    @delete="handleDelete"
    >
    </custom-table>
  </client-only>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'new' })
import customTable from '~/components/customTable.vue';

const { $showDialog } = useNuxtApp();
const { $notify } = useNuxtApp();

const { token }: any = useAuth();
const currentUserResolved = ref<Partial<User> | null>(null);
onMounted(async () => {
  currentUserResolved.value = await User.currentUser(token);
});


const layoutData: any = inject('layoutData');
console.log(layoutData.value.users);

const tableData = ref({
  head: [
    { text: 'Név', value: 'name' },
    { text: 'Telefonszám', value: 'phone' },
    { text: 'Méret', value: 'size', center: true},
    { text: 'Felirat', value: 'felirat'},
    { text: 'Fizetve', value: 'paid', center: true},
    { text: 'Megjegyzés', value: 'comment' }
  ],
  body: layoutData.value.polorendeles.map(order => ({
    ...order,
    paid: order.paid ? 'Igen' : 'Nem',
  }))
});

const handleAdd = async () => {
  const dialogData = {
    show: true,
    title: 'Új pólórendelés',
    desc: 'Add meg a pólórendelés adatait.',
    inputs: [
      { label: 'Név', model: 'name', type: 'text', placeholder: 'Nagy Miska', required: true },
      { label: 'Telefonszám', model: 'phone', type: 'text', placeholder: '+36301112222', required: true },
      { label: 'Póló méret', model: 'size', type: 'dropdown', dropdownopts: [
        { value: 'S'}, { value: 'M', default: true }, { value: 'L' }, { value: 'XL' }, { value: 'XXL' }
      ], required: true },
      { label: 'Felirat', model: 'felirat', type: 'text' },
      { label: 'Fizetve', model: 'paid', type: 'dropdown', dropdownopts: [
        { value: 'Igen', default: true}, { value: 'Nem' }
      ], required: true },
      { label: 'Megjegyzés', model: 'comment', type: 'text', placeholder: 'Bármilyen megjegyzés a rendeléshez' }
    ],
    buttons: [
      { label: 'Mégse', type: 'cancel', color: '#ccc', textcolor: '#000' },
      { label: 'Rendelés mentése', type: 'submit', color: '#4CAF50', textcolor: '#fff' }
    ]
  };


  async function showDialogWithValidation() {
    const result = await $showDialog(dialogData);
    if (result.button === 'submit') {
      const newOrder = {
        name: result.inputs[0].value,
        phone: result.inputs[1].value,
        size: result.inputs[2].value,
        felirat: result.inputs[3].value || null,
        paid: result.inputs[4].value === 'Igen',
        comment: result.inputs[5].value || null,
      };
      const errorMsg = validate(newOrder);
      if (errorMsg) {
        $notify(errorMsg, 'error');
        return showDialogWithValidation();
      }
      try {
        await $fetch('/api/polorendeles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${useCookie('token').value}` },
          body: newOrder
        });
        log.modification({
          title: 'Új pólórendelés',
          type: 'polorendeles_add',
          message: `Új pólórendelés mentve: ${newOrder.name}`,
          data: newOrder
        });
        $notify("Pólórendelés sikeresen mentve!", "success");
        layoutData.value.polorendeles.push(newOrder);
        refreshTable();
      } catch (error) {
        $notify("Hiba történt a pólórendelés mentésekor.", "error");
      }
    }
  }
  await showDialogWithValidation();
};

  const validate = (order: any) => {
    const nameRegex = /^([A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+\s){1,}[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/;
    const phoneRegex = /^(\+36|06)\d{8,9}$/;
    const sizeRegex = /^(S|M|L|XL|XXL)$/;
    if (!nameRegex.test(order.name.trim())) return 'Hibás név formátum!';
    if (!phoneRegex.test(order.phone.trim())) return 'Hibás telefonszám!';
    if (!sizeRegex.test(order.size)) return 'Hibás méret!';
    return '';
  };

  const handleModify = async (order: any) => {
    const dialogData = {
      show: true,
      title: 'Pólórendelés módosítása',
      desc: 'Módosítsd a pólórendelés adatait.',
      inputs: [
        { label: 'Név', model: 'name', type: 'text', value: order.name, placeholder: 'Nagy Miska', required: true },
        { label: 'Telefonszám', model: 'phone', type: 'text', value: order.phone, placeholder: '+36301112222', required: true },
        { label: 'Póló méret', model: 'size', type: 'dropdown', value: order.size, dropdownopts: [
          { value: 'S', default: order.size === 'S'}, { value: 'M', default: order.size === 'M' }, { value: 'L', default: order.size === 'L' }, { value: 'XL', default: order.size === 'XL' }, { value: 'XXL', default: order.size === 'XXL' }
        ], required: true },
        { label: 'Felirat', model: 'felirat', type: 'text', value: order.felirat || '' },
        { label: 'Fizetve', model: 'paid', type: 'dropdown', value: order.paid ? 'Igen' : 'Nem', dropdownopts: [
          { value: 'Igen', default: order.paid}, { value: 'Nem' }
        ], required: true },
        { label: 'Megjegyzés', model: 'comment', type: 'text', value: order.comment || '', placeholder: 'Bármilyen megjegyzés a rendeléshez' }
      ],
      buttons: [
        { label: 'Mégse', type: 'cancel', color: '#ccc', textcolor: '#000' },
        { label: 'Módosítás mentése', type: 'submit', color: '#4CAF50', textcolor: '#fff' }
      ]
    };

    const result = await $showDialog(dialogData);
    if (result.button === 'submit') {
      const updatedOrder = {
        ...order,
        name: result.inputs[0].value,
        phone: result.inputs[1].value,
        size: result.inputs[2].value,
        felirat: result.inputs[3].value || null,
        paid: result.inputs[4].value === 'Igen',
        comment: result.inputs[5].value || null,
      };
      const errorMsg = validate(updatedOrder);
      if (errorMsg) {
        $notify(errorMsg, 'error');
        return handleModify(order);
      }
      try {
        await $fetch(`/api/polorendeles/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${useCookie('token').value}` },
          body: updatedOrder
        });
        log.modification({
          title: 'Pólórendelés módosítása',
          type: 'polorendeles_modify',
          message: `Pólórendelés módosítva: ${updatedOrder.name}`,
          data: updatedOrder
        });
        $notify("Pólórendelés sikeresen módosítva!", "success");
        const index = layoutData.value.polorendeles.findIndex((o: any) => o.id === order.id);
        if (index !== -1) {
          layoutData.value.polorendeles[index] = updatedOrder;
        }
        refreshTable();
      } catch (error) {
        $notify("Hiba történt a pólórendelés módosításakor.", "error");
      }
    }
  };

  const handleDelete = async (order: any) => {
    const dialogData = {
      show: true,
      title: 'Pólórendelés törlése',
      desc: `Biztosan törölni szeretnéd a(z) ${order.name} pólórendelést?`,
      buttons: [
        { label: 'Mégse', value: 'cancel', color: '#ccc', textcolor: '#000' },
        { label: 'Törlés', value: 'submit', color: '#F44336', textcolor: '#fff' }
      ]
    };

    const result = await $showDialog(dialogData);
    if (result.button === 'submit') {
      try {
        await $fetch(`/api/polorendeles/${order.id}/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${useCookie('token').value}` }
        });
        log.modification({
          title: 'Pólórendelés törlése',
          type: 'polorendeles_delete',
          message: `Pólórendelés törölve: ${order.name}`,
          data: order
        });
        $notify("Pólórendelés sikeresen törölve!", "success");
        layoutData.value.polorendeles = layoutData.value.polorendeles.filter((o: any) => o.id !== order.id);
        refreshTable();
      } catch (error) {
        $notify("Hiba történt a pólórendelés törlésekor.", "error");
      }
    }
  };    

  const refreshTable = () => {
    tableData.value.body = layoutData.value.polorendeles.map(order => ({
      ...order,
      paid: order.paid ? 'Igen' : 'Nem',
    }));
  };

</script>

<style>

</style>