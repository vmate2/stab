<template>
  <div class="email-container">
    <aside class="sidebar">
      <div class="header">
        <h2>Emailek - {{ email }}</h2>
        <button class="compose-btn" @click="openCompose">+ Új email</button>
      </div>

      <div class="section">
        <h3>Bejövő levelek</h3>
        <ul>
          <li v-for="mail in inbox" :key="mail.id" @click="selectMail(mail)" :class="{ selected: selectedMail?.id === mail.id }">
            <strong>{{ mail.from }}</strong><br />
            <span class="subject">{{ mail.subject }}</span>
          </li>
        </ul>
      </div>

      <div class="section">
        <h3>Kimenő levelek</h3>
        <ul>
          <li v-for="mail in sent" :key="mail.id" @click="selectedMail = mail" :class="{ selected: selectedMail?.id === mail.id }">
            <strong>→ {{ mail.to }}</strong><br />
            <span class="subject">{{ mail.subject }}</span>
          </li>
        </ul>
      </div>
    </aside>

    <main class="content">
      <div v-if="selectedMail" class="mail-view">
        <h2>{{ selectedMail.subject }}</h2>
        <p><strong>From:</strong> {{ selectedMail.from }}</p>
        <p><strong>To:</strong> {{ selectedMail.to }}</p>
        <div v-if="selectedMail.isHtml" class="body" v-html="selectedMail.html"></div>
        <pre v-else class="body">{{ selectedMail.text }}</pre>
      </div>
      <div v-else class="placeholder">Válassz egy emailt a listából</div>
    </main>

    <div v-if="compose" class="compose-modal">
      <div class="compose-preview-frame fixed-center">
        <h2 class="compose-title">FinalDeal - Szponzorációs megkeresés</h2>

        <input v-model="newMail.subject" placeholder="Tárgy" class="input-subject" />

        <div class="toolbar">
          <button
            :class="{ active: isActive('bold') }"
            @click.prevent="toggleFormat('bold')"
            title="Félkövér"
          ><b>B</b></button>

          <button
            :class="{ active: isActive('italic') }"
            @click.prevent="toggleFormat('italic')"
            title="Dőlt"
          ><i>I</i></button>

          <button
            :class="{ active: isActive('underline') }"
            @click.prevent="toggleFormat('underline')"
            title="Aláhúzott"
          ><u>U</u></button>

          <input
            type="color"
            v-model="fontColor"
            @input="applyColor"
            title="Betűszín"
            class="color-picker"
          />

          <button
            :class="{ active: isActive('justifyCenter') }"
            @click.prevent="toggleFormat('justifyCenter')"
            title="Középre igazítás"
          >⇔</button>

          <button
            :class="{ active: isActive('justifyLeft') }"
            @click.prevent="toggleFormat('justifyLeft')"
            title="Balra igazítás"
          >⇤</button>

          <button
            :class="{ active: isActive('justifyRight') }"
            @click.prevent="toggleFormat('justifyRight')"
            title="Jobbra igazítás"
          >⇥</button>

          <select v-model="fontSize" @change="applyFontSize" title="Betűméret">
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px</option>
            <option value="4">18px</option>
            <option value="5">24px</option>
            <option value="6">32px</option>
            <option value="7">48px</option>
          </select>
        </div>

        <div
          class="rich-text-input"
          ref="editor"
          contenteditable="true"
          @input="updateBody"
          @mouseup="updateToolbarState"
          @keyup="updateToolbarState"

        ></div>

        <div class="footer-preview">
          <div class="contact-block">
            <p><strong>Madai István Richárd</strong> – jelölt</p>
            <p><strong>📧</strong> <a href="mailto:madai.istvan.r@gmail.com">madai.istvan.r@gmail.com</a></p>
            <p><strong>📞</strong> <a href="tel:+36203456789">+36 20 345 6789</a></p>
          </div>
          <div class="contact-block">
            <p><strong>Varga Máté</strong> – kampányfőnök</p>
            <p><strong>📧</strong> <a href="mailto:vargamate123@gmail.com">vargamate123@gmail.com</a></p>
            <p><strong>📞</strong> <a href="tel:+36201234567">+36 20 123 4567</a></p>
          </div>
        </div>

        <div class="actions">
          <button @click="sendMail">Küldés</button>
          <button @click="compose = false">Mégse</button>
        </div>
      </div>
    </div>
  </div>
  <spinner v-if="!inbox || !sent"></spinner>
</template>



<script lang="ts" setup>
definePageMeta({ layout: 'new' });
import spinner from '~/components/spinner.vue';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { token } = useAuth();
const route = useRoute();
const email = computed(() => decodeURIComponent(route.params.sponsoremail as string));

const inbox = ref<any[]>([]);
const sent = ref<any[]>([]);
const selectedMail = ref(null);
const compose = ref(false);
const editor = ref<HTMLElement | null>(null);

const fontColor = ref('#ffffff');
const fontSize = ref('3'); // alap betűméret 16px

const newMail = ref({
  to: '',
  subject: '',
  html: '',
  text: '',
  isHtml: true,
});

async function fetchEmails() {
  if (!token.value) return;

  const inboxData = await $fetch('/api/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: { email: email.value },
  });
  inbox.value = inboxData;

  const sentData = await $fetch('/api/getsentemails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: { email: email.value },
  });
  sent.value = sentData;
}

fetchEmails();

function updateBody() {
  if (editor.value) {
    newMail.value.html = editor.value.innerHTML;
    console.log(editor.value.innerHTML, newMail.value);
    
  }
}

function execFormat(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
  updateBody();
  updateToolbarState();
}

function toggleFormat(cmd: string) {
  // Ha nincs kijelölés, beállítja a formázást az új szövegre is
  if (!hasSelection()) {
    // execCommand megengedi, hogy így is működjön
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(cmd, false);
  } else {
    document.execCommand(cmd, false);
  }
  updateBody();
  updateToolbarState();
}

function hasSelection(): boolean {
  const sel = window.getSelection();
  return !!sel && !sel.isCollapsed;
}

function isActive(cmd: string): boolean {
  if (!editor.value) return false;

  switch (cmd) {
    case 'bold': return document.queryCommandState('bold');
    case 'italic': return document.queryCommandState('italic');
    case 'underline': return document.queryCommandState('underline');
    case 'justifyCenter': return document.queryCommandState('justifyCenter');
    case 'justifyLeft': return document.queryCommandState('justifyLeft');
    case 'justifyRight': return document.queryCommandState('justifyRight');
    default: return false;
  }
}

function applyColor() {
  if (!fontColor.value) return;

  // Bekapcsolja, hogy CSS-sel dolgozzon a formatálás
  document.execCommand('styleWithCSS', false, 'true');
  document.execCommand('foreColor', false, fontColor.value);
  updateBody();
}



function applyFontSize() {
  if (!fontSize.value) return;
  document.execCommand('fontSize', false, fontSize.value);
  updateBody();
}

function sendMail() {
  if (!newMail.value.subject || !editor.value?.innerHTML)
    return alert('Tárgy és üzenet megadása kötelező!');

  const bodyHtml = editor.value.innerHTML;
  const wrappedHtml = wrapHtmlContent(newMail.value.subject, bodyHtml);
  const plainText = stripHtmlAndStyles(bodyHtml);
  newMail.value.html = wrappedHtml
  sent.value.push({
    from: email.value,
    to: newMail.value.to,
    subject: newMail.value.subject,
    html: wrappedHtml,
    text: plainText,
    isHtml: true,
    date: Date.now()
  });

  console.log('Küldött email:', newMail.value);

  compose.value = false;
  newMail.value = {
    to: email.value,
    subject: '',
    html: '',
    text: '',
    isHtml: true,
  };

  if (editor.value) editor.value.innerHTML = '';
}


function stripHtmlAndStyles(input: string): string {
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // eltávolítja a <style> blokkokat
    .replace(/<[^>]*>/g, '') // eltávolítja a többi HTML taget
    .trim();
}


watch(email, () => {
  fetchEmails();
  selectedMail.value = null;
});

async function handleMailOpen(mail: any) {
  if (!mail.opened) {
    await $fetch('/api/emails', {
      headers: { Authorization: `Bearer ${token.value}` },
      method: 'PATCH',
      body: { id: mail.messageId },
    });
  }
}

function openCompose() {
  compose.value = true;
  newMail.value.to = email.value;

  // A mintaszöveg automatikus betöltése az editorba
  nextTick(() => {
    if (editor.value) {
      editor.value.innerHTML = defaultBodyHtml;
      updateBody();
      updateToolbarState();
    }
  });
}

function selectMail(mail: any) {
  selectedMail.value = mail;
  handleMailOpen(mail);
}

const defaultBodyHtml = `
<p>Kedves Partnerünk!</p>
<p>A FinalDeal csapata nevében szeretnénk megkeresni Önt egy izgalmas szponzorációs lehetőséggel.</p>
<p>Ez az ország legnagyobb diák csapata, akik elkötelezettek a siker és a közösség iránt.</p>
<p>Amennyiben érdekli a részletek, kérjük, vegye fel velünk a kapcsolatot.</p>
<p>Üdvözlettel,<br />FinalDeal csapata</p>
`;

// Toolbar állapotának frissítése
function updateToolbarState() {
  // Ez frissíti a gombok aktív állapotát a Vue-ban, így isActive metódus frissül
  // Új input / mouseup / keyup eseményeknél meghívódik
}
function wrapHtmlContent(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>
<body style="margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, #7b1f2d, #401014);">
  <div style="background:#4a1720; padding:20px; border-radius:8px; color:#fff; font-family:sans-serif; max-width:600px; width:90%; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
    <h2 style="text-align:center; font-weight:bold; margin-bottom:20px;">FinalDeal - BSZC Trefort</h2>

    <div style="background:#5a1f2b; padding:15px; border-radius:6px; white-space: pre-line; font-size:16px; line-height:1.5;">
        ${body}
    </div>

    <div style="display:flex; justify-content: space-between; margin-top:30px; background:#5a1f2b; padding:15px; border-radius:6px; font-size:14px; color:#ffd9d9; flex-wrap: wrap; gap: 20px;">
      <div style="flex:1 1 45%; min-width: 250px;">
        <strong>Madai István Richárd</strong> - jelölt<br>
        <span>📧 <a href="mailto:madai-istvan-richard@finaldeal.hu" style="color:#f5c6cb; text-decoration:none;">madai-istvan-richard@finaldeal.hu</a></span><br>
        <span>📞 +36 30 622 9608</span>
      </div>
      <div style="flex:1 1 45%; min-width: 250px;">
        <strong>Varga Máté</strong> - kampányfőnök<br>  
        <span>📧 <a href="mailto:vargamate@finaldeal.hu" style="color:#f5c6cb; text-decoration:none;">vargamate@finaldeal.hu</a></span><br>
        <span>📞 +36 30 844 9812</span>
      </div>
      <div style="flex:1 1 45%; min-width: 250px;">
        <strong><a href="https://taszi.hu" style="color:#ffd9d9; text-decoration:none;">BSZC Trefort Ágoston Technikum, Szakképző iskola és Kollégium</a></strong><br>
        <span>5600, Békéscsaba Puskin tér 1.</span><br>
      </div>
      <div style="flex:1 1 45%; min-width: 250px;">
        <strong><a href="https://finaldeal.hu/rolunk" style="color:#ffd9d9; text-decoration:none;">FinalDeal.hu</a></strong><br>
        <span>További információ a weboldalon</span>
      </div>
    </div>
  </div>
</body>
</html>
`
}

</script>


<style scoped>
.email-container {
  display: flex;
  width: 80vw;
  height: 85vh;
  max-width: 1600px;
  margin: auto;
  background-color: #1e1e1e;
  color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}

.sidebar {
  width: 30%;
  background: #2c2c2c;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  overflow-y: auto;
}

.sidebar .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compose-btn {
  background: #4caf50;
  border: none;
  padding: 0.4rem 0.8rem;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.section h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #bbb;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section li {
  padding: 0.6rem;
  margin-bottom: 0.4rem;
  background: #3a3a3a;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.section li:hover,
.section li.selected {
  background: #555;
}

.subject {
  font-size: 0.85rem;
  color: #ccc;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.mail-view h2 {
  margin-bottom: 0.5rem;
}

.body {
  white-space: pre-wrap;
  margin-top: 1rem;
  font-family: monospace;
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 6px;
}

.placeholder {
  color: #aaa;
  font-style: italic;
}

.compose-preview-frame {
  background: #3a0f16;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 650px;
  box-shadow: 0 0 25px rgba(255, 0, 43, 0.3);
  font-family: 'Georgia', serif;
  color: white;
  border: 2px solid #7e0b23;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;
}

.compose-title {
  font-size: 1.5rem;
  color: #f8e3e3;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
}

.input-subject {
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  background: #1e1e1e;
  color: white;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
}

.toolbar button {
  background: #5a1a22;
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  transition: background-color 0.2s;
}

.toolbar button.active,
.toolbar button:hover {
  background-color: #7e0b23;
}

.color-picker {
  width: 36px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background: white;
}

select {
  background: #5a1a22;
  color: white;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.rich-text-input {
  width: 100%;
  min-height: 220px;
  background: #1a1a1a;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  overflow-y: auto;
}

.footer-preview {
  background: #2a0a10;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  color: #f4f4f4;
  font-size: 0.9rem;
  justify-content: space-between;
}

.contact-block {
  min-width: 220px;
}

.footer-preview a {
  color: #e589a9;
  text-decoration: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.actions button {
  background: #7e0b23;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

@media (max-width: 768px) {
  .email-container {
    flex-direction: column;
    width: 100vw;
    height: 90vh;
  }

  .sidebar {
    width: 100%;
    height: 40%;
    flex-direction: column;
    overflow-y: auto;
  }

  .content {
    height: 60%;
  }
}
</style>
