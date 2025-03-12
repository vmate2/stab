<template>
  <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <div class="topbar">
      <div :class="{active:active == 0}" @click="active = 0"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 12H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="9" cy="12" r="1" fill="#000000"></circle> <circle cx="9" cy="16" r="1" fill="#000000"></circle> </g></svg><div>Szponzorlista</div></div>
      <div @click="selectFile"><svg fill="#000000" width="25" height="25" viewBox="-192 -192 2304.00 2304.00" xmlns="http://www.w3.org/2000/svg" stroke="red" stroke-width="0.0192"><g id="SVGRepo_iconCarrier"> <path d="m807.186 686.592 272.864 272.864H0v112.94h1080.05l-272.864 272.978 79.736 79.849 409.296-409.183-409.296-409.184-79.736 79.736ZM1870.419 434.69l-329.221-329.11C1509.688 74.07 1465.979 56 1421.48 56H451.773v730.612h112.94V168.941h790.584v451.762h451.762v1129.405H564.714v-508.233h-112.94v621.173H1920V554.52c0-45.176-17.619-87.754-49.58-119.83Zm-402.181-242.37 315.443 315.442h-315.443V192.319Z" fill-rule="evenodd"></path> </g></svg><div>Import</div></div>
      <div><svg fill="#000000" width="25" height="25" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"> <path d="m0 1016.081 409.186 409.073 79.85-79.736-272.867-272.979h1136.415V959.611H216.169l272.866-272.866-79.85-79.85L0 1016.082ZM1465.592 305.32l315.445 315.445h-315.445V305.32Zm402.184 242.372-329.224-329.11C1507.042 187.07 1463.334 169 1418.835 169h-743.83v677.647h112.94V281.941h564.706v451.765h451.765v903.53H787.946V1185.47H675.003v564.705h1242.353V667.522c0-44.498-18.07-88.207-49.581-119.83Z" fill-rule="evenodd"></path> </g></svg><div>Export</div></div>
      <div :class="{active:active == 1}" @click="sendSelectedEmails()"><svg style="position: relative; top: 1px;" viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"> <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg><div>Emailek küldése</div></div>
      <div :class="{active:active == 2}" @click="active = 2"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M22 6.25V11.35C22 12.62 21.58 13.69 20.83 14.43C20.09 15.18 19.02 15.6 17.75 15.6V17.41C17.75 18.09 16.99 18.5 16.43 18.12L15.46 17.48C15.55 17.17 15.59 16.83 15.59 16.47V12.4C15.59 10.36 14.23 9 12.19 9H5.39999C5.25999 9 5.13 9.01002 5 9.02002V6.25C5 3.7 6.7 2 9.25 2H17.75C20.3 2 22 3.7 22 6.25Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.59 12.4V16.47C15.59 16.83 15.55 17.17 15.46 17.48C15.09 18.95 13.87 19.87 12.19 19.87H9.47L6.45 21.88C6 22.19 5.39999 21.86 5.39999 21.32V19.87C4.37999 19.87 3.53 19.53 2.94 18.94C2.34 18.34 2 17.49 2 16.47V12.4C2 10.5 3.18 9.19002 5 9.02002C5.13 9.01002 5.25999 9 5.39999 9H12.19C14.23 9 15.59 10.36 15.59 12.4Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg><div>Válaszok</div></div>
      <div class="delete">TÖRLÉS</div>
    </div>
    <div class="mainBody" id="szponzorlista" v-if="active == 0">
      <div class="row headerRow">
        <input 
            type="checkbox" 
            v-model="selectAll" 
            @change="toggleSelectAll"
          />
        <div>Cégnév</div>
        <div>e-mail</div>
        <div>Telefonszám</div>
        <div>Kapcsolattartó</div>
        <div>Siker</div>
      </div>
      <client-only>
      <div class="row" v-if="sponsors" v-for="sponsor in sponsors" :key="sponsor.id">
        <input 
          class="checkbox"
          type="checkbox" 
          v-model="selectedSponsors"
          :value="sponsor.id"
        />

        <div>{{ sponsor.name }}</div>
        <div>{{ sponsor.email }}</div>
        <div>{{ sponsor.phone }}</div>
        <div>{{ sponsor.contact }}</div>
        <div style="user-select: none;">{{ sponsor.success }}</div>
      </div>
      <div v-else class="row">
        <div style="column-span: all;">Adatok betöltése folyamatban...</div>
      </div>
    </client-only>
    </div>
    <div class="mainBody" id="emailek" v-if="active == 1"></div>
    <div class="mainBody" id="valaszok" v-if="active == 2"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { inject } from 'vue';
import newDialBox from '~/components/newDialBox.vue';


const { $notify } = useNuxtApp();
const { $showDialog } = useNuxtApp();

const handleDialog = async (title:string, text:string, buttons:string[], input:boolean) => {
  if (!$showDialog) {
    console.error('$showDialog is undefined! Check the plugin.');
    return;
  }
  const result = await $showDialog(title, text, buttons, input);
  console.log('Dialog result:', result);
  return result;
};



    const updateSponsorsWithFileContent = () => {
      // Ensure sponsors.value has enough items
      while (sponsors.value.length < fileContent.value.length) {
        sponsors.value.push({
          contact: "",
          desc: null,
          email: "",
          id: 0,
          name: "",
          phone: "",
          success: "✅"
        });
      }
    
      // Map fileContent to sponsors.value
      sponsors.value = sponsors.value.map((sponsor:any, index:any) => ({
        contact: fileContent.value[index]?.Kapcsolattartó || sponsor.contact,
        desc: null, // Assuming desc is always null or not provided in fileContent
        email: fileContent.value[index]?.Email || sponsor.email,
        id: fileContent.value[index]?.__rowNum__ || sponsor.id,
        name: fileContent.value[index]?.Cégnév || sponsor.name,
        phone: fileContent.value[index]?.Telefonszám || sponsor.phone,
        success: fileContent.value[index]?.Folyamat || sponsor.success
      }));
    };


    

    const displayDialog = async (val:number) => {
      switch (val) {
        case 1:
          const result1 = await handleDialog('Mit szeretnél tenni?', "A felülírás lecseréli az eddig létező sorokat az importban szereplőkre, ami nincs benne az importban törli. A kihagyás csak hozzáadja az új sorokat és módosítja a meglévőket új adatokkal.", ['Kihagyás', 'Felülírás'], false);
          if (result1?.button == 'Kihagyás') {
            console.log('Kihagyás');
          } else if (result1?.button == 'Felülírás') {
            console.log('Felülírás');
            updateSponsorsWithFileContent();
            try {
              const { data, status, error, refresh } = await useFetch('/api/sponsors/',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: { sponsors: sponsors.value }
              });
              console.log(data.value);
              $notify('Sikeres importálás!', 'success');
            } catch (error) {
              console.error(error);
              $notify('Hiba az importálással!', 'warning');   
            }
          } else {
            throw new Error('Invalid dialog result');
          }
          break;
      
        default:
          break;
      }
    }


const layoutData: any = inject('layoutData');

const sponsors = ref(layoutData.value.sponsors);
console.log(sponsors.value);


  const selectedSponsors: any = ref([]);

definePageMeta({
  layout: 'new',
});

const isSelected = (sponsorId: number) => selectedSponsors.value.includes(sponsorId);

const toggleSelection = (sponsorId: number) => {
  if (selectedSponsors.value.includes(sponsorId)) {
    selectedSponsors.value = selectedSponsors.value.filter((id: number) => id !== sponsorId);
  } else {
    selectedSponsors.value.push(sponsorId);
  }
};

const selectAll = computed({
  get: () => selectedSponsors.value.length === sponsors.value.length && sponsors.value.length > 0,
  set: (checked) => { toggleSelectAll(checked)}
});

// Function to toggle Select All
const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    console.log(selectedSponsors.value);
    
    selectedSponsors.value = sponsors.value.map((s: { id: any; }) => s.id);
  } else {
    selectedSponsors.value = []; // Clear all selections
  }
};



const active = ref(0);


const fileContent = ref();
const fileName = ref('');
const isFileSelected = ref(false);

import * as XLSX from 'xlsx';
import { data } from 'autoprefixer';

const selectFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.json,.csv,.xls,.xlsx'; // Add Excel formats

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
      isFileSelected.value = false;
      return;
    }

    isFileSelected.value = true;
    fileName.value = file.name;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        // Parse Excel file
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        fileContent.value = XLSX.utils.sheet_to_json(sheet);
        console.log(fileContent.value);

        if (fileContent.value[1].Cégnév && fileContent.value[1].Telefonszám && fileContent.value[1].Email && fileContent.value[1].Folyamat){
          displayDialog(1);
          
        } else {
          $notify('A feltöltött fájl nem a helyes formátumban van megformázva!', 'warning');
          fileContent.value = undefined;
        }
        
      } else {
        $notify('Sikeres importálás!', 'success');
        fileContent.value = data;
      }
    };

    // Read as array buffer for Excel files, text for others
    if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });

  input.click();
};


onMounted(() => {
  function adjustTextSize() {
  const rows = document.querySelectorAll('.row');
  
  rows.forEach(row => {
    const rowWidth = row.offsetWidth;
    let fontSize = Math.max(1, rowWidth / 100) + 'px'; // Set a minimum font size of 1px

    row.style.fontSize = fontSize;
  });
}

// Run the function when the page loads
window.addEventListener('load', adjustTextSize);

// Run the function when the window is resized
window.addEventListener('resize', adjustTextSize);
})




//TEST\\

const sendSelectedEmails = () => {
  selectedSponsors.value.forEach((sponsorId: number) => {
    const sponsor = sponsors.value.find((s: any) => s.id === sponsorId);
    if (sponsor && sponsor.email) {
      console.log(sponsor);
      return sponsor;
    }
  });
};

const sendMail = () => {


  const { data, status, error, refresh } = useFetch('/api/sendmail', {
  method: 'POST',
  headers: {},
  body: { "sponsors": [] }
});
console.log(data);
}







</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.dialog {
  position: absolute;
  top: 30vh;
  left: 30vw;
}

.headerRow {
  position: sticky;
  background-color: gray;
  border-bottom: 2px solid black !important;
}

.headerRow > div {
  cursor: pointer;
  user-select: none;
  font-weight: bold;
}

.active {
  color: rgb(20, 20, 200);
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 0.3fr 2fr 2fr 2fr 2fr 0.5fr;
  align-items: center;
  justify-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* Default font size */
  border-bottom: 1px solid black;
  user-select: text !important;
  min-height: auto;
  height: fit-content;
  overflow: visible;
}

.row > div {
  width: 100%;
  height: 100%;
  padding: 5px; /* Adjust padding to fit within the grid */
  overflow: hidden; /* Prevents text from overflowing */
  text-overflow: ellipsis; /* Adds "..." for overflowing text */
  white-space: nowrap; /* Prevents text from breaking into multiple lines */
  text-align: start;
  align-content: center;
}


.mainBody {
  width: 95%;
  height: 80vh;
  background-color: gray;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  max-height: 80vh; /* Ensures the body doesn't overflow */
  overflow-y: scroll; /* Allows scrolling only on the Y-axis */
  overflow-x: hidden; /* Ensures no horizontal scrolling */
}

.topbar {
  width: 95%;
  height: 5vh;
  background-color: gray;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  align-items: center;
  justify-items: center;
  gap: 1rem; /* Space between items */
  border-bottom: 2px solid black;
}

.topbar > div {
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  transition: color 0.3s ease; /* Smooth transition */
}

.topbar > div:hover:not(.delete) {
  color: hsl(0, 0%, 100%); /* White on hover */
  fill: currentColor;
  stroke: currentcolor;
}

.topbar > div:active {
  transform: scale(0.9); /* Scale effect on click */
}



.delete {
  justify-self: end;
  color: rgb(250, 100, 100);
  margin-right: 10%;
  font-weight: bold;
}

.delete:hover {
  color: red;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .row {
    grid-template-columns: 1fr; /* Egy oszlopra váltás mobilon */
    text-align: center;
    font-size: 0.9em;
  }

  .headerRow {
    display: none; /* Fejléc elrejtése mobilon */
  }

  .topbar > div > div {
    display: none;
  }

  .delete {
    justify-self: center; /* Center delete button on small screens */
    margin-right: 0;
  }
  .checkbox {
    display: none;
  }
}

</style>


