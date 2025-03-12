<template>
  <div class="profileContainer">
    <div style="color: yellow; text-shadow: black 2px 2px; font-family: 'Courier New', Courier, monospace; margin-right: 15px; cursor: default; position: relative;" v-if="hasPenzugyperms" class="currStabcash">
      {{ currStabcash + 'ft' }}
      <span class="tooltip">Összes stábpénz.</span>
    </div>
    <div style="color: green; text-shadow: black 2px 2px; font-family: 'Courier New', Courier, monospace; margin-right: 15px; cursor: default; position: relative;" class="paidStabcash">
      {{ paidStabcash + 'ft' }}
      <span class="tooltip">Fizetett stábpénz.</span>
    </div>
    <client-only>
    <NuxtLink v-if="profile.uuid || profile.uuid !== ''" :to="`/stab/user/${profile.uuid}`" class="link">
      <div v-if="profile.name || profile.name !== ''" class="name">{{ profile.name }}</div>
      <div v-else class="name">Betöltés...</div>
      <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="40" height="40"><path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-4,21.164v-.164c0-2.206,1.794-4,4-4s4,1.794,4,4v.164c-1.226.537-2.578.836-4,.836s-2.774-.299-4-.836Zm9.925-1.113c-.456-2.859-2.939-5.051-5.925-5.051s-5.468,2.192-5.925,5.051c-2.47-1.823-4.075-4.753-4.075-8.051C2,6.486,6.486,2,12,2s10,4.486,10,10c0,3.298-1.605,6.228-4.075,8.051Zm-5.925-15.051c-2.206,0-4,1.794-4,4s1.794,4,4,4,4-1.794,4-4-1.794-4-4-4Zm0,6c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2Z"/></svg></div>
      <span class="tooltip">Navigálás a profilodra.</span>
    </NuxtLink>
  </client-only>
  </div>
</template>

<script lang="ts" setup>

const link = ref();
const hasPenzugyperms = ref(true);
const currStabcash = ref(200);
const paidStabcash = ref(300);

const profile = ref({
  name: '',
  uuid: '',
});

interface User {
  id: number;
  name: string;
  post: string;
  email: string;
  phone: string;
  paidcash: number | null;
  school: string | null;
  city: string | null;
  uuid: string;
}


const props = defineProps({
  profile: {
    type: Object as PropType<Pick<User, 'name' | 'uuid'>>,
    default: () => ({
      name: '',
      uuid: '',
    }),
  },
});

profile.value = props.profile;


link.value = `/stab/user/${props.profile.uuid}`;
</script>

<style scoped>
  .profileContainer {
    width: 100%;
    height: 5%;
    min-height: 45px;
    max-height: 55px;
    display: flex;
    justify-content: end;
    align-items: center;
  }

  .profileContainer > a {
    display: flex;
    justify-content: end;
    align-items: center;
    flex-direction: row;
  }

  a:hover {
    --text-primary-color: rgb(182, 233, 253);
  }
  a:active {
    scale: 0.95;
  }

  .profileContainer > :last-child {
    margin-right: 2rem;
  }

  .profileContainer > a > div {
    margin-left: 15px;
    font-family: var(--primary-font);
    color: var(--text-primary-color);
    font-weight: var(--font-weight);
    font-size: 1.2em;
  }

  .paidStabcash:hover .tooltip,
  .currStabcash:hover .tooltip,
  a:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
  .tooltip {
  visibility: hidden;
  width: 200px;
  color: #333;
  font-weight: 700;
  text-align: center;
  border-radius: 5px;
  padding: 2px 0;
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  top: 30px;
  background-color: white;
  text-shadow: none;
  font-family: 'Courier New', Courier, monospace;
  
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

@media (max-width: 768px) {
  /* Styles for phones */
  .tooltip {
    display: none;
  }
  .name {
    display: none;
  }

}
</style>