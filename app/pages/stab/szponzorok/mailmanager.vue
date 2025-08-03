<template>
  <div class="maincontainer">
    <div class="optionsCont">
      <input
        v-model="filter"
        type="text"
        class="filter"
        placeholder="Keresés.."
        list="sponsor-names"
      />
      <button @click="sendEmails()">Felkérő email küldése</button>
      <datalist id="sponsor-names">
        <option v-for="s in selectedSponsors" :key="s.email" :value="s.name" />
      </datalist>
    </div>
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" id="selectAll" @change="toggleSelectAll" :checked="allSelected" style="align-self: flex-start;"/></th>
          <th>Cég neve</th>
          <th>Cég e-mail címe</th>
          <th>Státusz</th>
          <th>Művelet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sponsor in filteredSponsors" :key="sponsor.email">
          <td><input type="checkbox" v-model="selected" :value="sponsor.email" /></td>
          <td>{{ sponsor.name }}</td>
          <td>{{ sponsor.email }}</td>
          <td style="justify-self: center; align-self: center;">
            <span v-if="sponsor.hasNewEmail" class="new-email-indicator" title="Új email"></span>
            {{ sponsor.status }}
          </td>
          <td>
            <svg class="viewmail" @click="goToLevelezes(sponsor.email)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.2715 18.2637L20.9996 20M11.5 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V11M20.6067 8.26229L15.5499 11.6335C14.2669 12.4888 13.6254 12.9165 12.932 13.0827C12.3192 13.2295 11.6804 13.2295 11.0677 13.0827C10.3743 12.9165 9.73279 12.4888 8.44975 11.6335L3.14746 8.09863M20 16.5C20 17.8807 18.8807 19 17.5 19C16.1193 19 15 17.8807 15 16.5C15 15.1193 16.1193 14 17.5 14C18.8807 14 20 15.1193 20 16.5Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'new' });

const { token } = useAuth();
const router = useRouter();

const { data: selectedSponsors, error } = await useFetch<{ name: string; email: string; status: string }[]>(
  '/api/sponsors/getformail',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.value}`
    },
    key: 'sponsor-mail-fetch'
  }
);

function goToLevelezes(sponsorEmail: string) {
  const encoded = encodeURIComponent(sponsorEmail);

  const sponsor = sponsorsWithNewEmail.value.find(s => s.email === sponsorEmail);
  if (sponsor?.hasNewEmail) {
    // PATCH kérés az olvasottság beállítására
    $fetch('/api/emails', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: sponsorEmail })
    });
  }

  navigateTo(`/stab/szponzorok/levelezes/${encoded}`);
}

const selected = ref<string[]>([]);

const allSelected = computed(() =>
  filteredSponsors.value.length > 0 &&
  filteredSponsors.value.every(s => selected.value.includes(s.email))
);

function toggleSelectAll(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  const emails = filteredSponsors.value.map(s => s.email);
  if (isChecked) {
    selected.value = Array.from(new Set([...selected.value, ...emails]));
  } else {
    selected.value = selected.value.filter(email => !emails.includes(email));
  }
}

const filter = ref('');

const uniqueSponsors = computed(() => {
  const seen = new Set();
  return selectedSponsors.value.filter(s => {
    if (seen.has(s.email)) return false;
    seen.add(s.email);
    return true;
  });
});

const inbox = await $fetch('/api/storedemails', {
  method: 'GET',
  headers: {
    authorization: `Bearer ${token.value}`
  }
});

const inboxEmails = (inbox as any[] || []).map(email => ({
  ...email,
  from: email.from?.toLowerCase()
}));

const sponsorsWithNewEmail = computed(() => {
  return uniqueSponsors.value.map(sponsor => {
    const hasUnseen = inboxEmails.some(mail =>
      mail.from?.includes(sponsor.email.toLowerCase()) && mail.opened === false
    );
    return {
      ...sponsor,
      hasNewEmail: hasUnseen
    };
  });
});

const filteredSponsors = computed(() =>
  sponsorsWithNewEmail.value.filter(sponsor =>
    sponsor.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    sponsor.email.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const sendEmails = async () => {
  console.error('SNEDING');
  
  const response = await $fetch('/api/sendFirstSponsorEmail', {
    method: 'POST'
  })
  console.log(response);
  
 
}


</script>

<style scoped>

.optionsCont {
  width: clamp(200px, 60%, 600px);
  height: fit-content;
  min-height: 20vh;
  border: 2px solid white;
  justify-self: center;
  border-radius: 15px;
  box-shadow: rgba(20, 20, 20, 0.4) 2px 2px 5px 5px;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
button {
  width: 30%;
  justify-self: center;
}

.filter {
  width: 90%;
  height: 15%;
  border-radius: 12px;
  justify-self: center;
  margin-top: 2%;
  padding: 5px 1%;
}

.maincontainer {
  height: 85vh;
  width: 99%;
  padding: 1rem;
  overflow: hidden; /* a táblázat görgethető, nem ez */
  display: flex;
  flex-direction: column;
  align-items: center;
}

table {
  border: 2px solid white;
  width: clamp(500px, 70%, 1600px);
  color: white;
  box-shadow: rgba(20, 20, 20, 0.4) 2px 2px 5px 5px;
  border-collapse: collapse;
  overflow: hidden;
  background: #1e1e1e;
}

/* Görgethető tbody */
table tbody {
  display: block;
  max-height: 57.5vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

/* Fix header */
table thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/* Státusz középre igazítás */
td:last-child {
  text-align: center;
  vertical-align: middle;
}

/* Egyedi scrollbar (Chrome, Edge, Safari) */
table tbody::-webkit-scrollbar {
  width: 10px;
}
table tbody::-webkit-scrollbar-track {
  background: #1e1e1e;
  border-radius: 5px;
}
table tbody::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}
table tbody::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

td:nth-child(4) {
  text-align: center;
  vertical-align: middle;
}

td, th {
  line-height: 2.2rem; /* fix line-height */
  padding: 0.4rem 0.6rem;
}

td {
  border: 1px solid rgb(143, 143, 143);
}

td:first-child input[type="checkbox"],
th:first-child input[type="checkbox"] {
  margin-left: 0.4rem;
  transform: scale(1.5);
}

th:first-child,
td:first-child {
  width: 2.5rem; /* vagy 40px – ahogy tetszik */
  text-align: center;
}

td:last-child {
  width: 2.5rem;
  align-items: center;
}

.viewmail {
  cursor: pointer;
}

.new-email-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}

</style>