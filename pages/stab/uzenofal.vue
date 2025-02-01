<template>
  <div>
    <div class="contentUzenofal">
      <div class="uzenetCont">
        <div class="felsoCont">
          <div class="szerzo">Varga Máté</div>
          <div class="idoU">2024.02.20</div>
        </div>
        <div class="cim">Stábgyűlés</div>
        <div class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur eos ut quibusdam natus vel consequuntur ipsa maiores unde nesciunt id, sint nemo fugit non similique nisi quos voluptates assumenda consectetur.</div>
        <img src="/public/img/logo.jpeg" alt="kép" contenteditable="false" class="kep">
        <div class="voteCont">
          <div class="szavazasFelirat">Szavazás</div>
          <div class="szavOpt">Option1</div>
          <progress class="progressbar" max="100" min="0" value="70"></progress>
          <input type="radio" name="checkbtn" class="checkbtn">
          <div class="szavOpt">Option2</div>
          <progress class="progressbar" max="100" min="0" value="15"></progress>
          <input type="radio" name="checkbtn" class="checkbtn">
          <div class="szavOpt">Option3</div>
          <progress class="progressbar" max="100" min="0" value="15"></progress>
          <input type="radio" name="checkbtn" class="checkbtn">
        </div>
      </div>
      <div class="uzenetCont">
        <div class="felsoCont">
          <div class="szerzo">Varga Máté</div>
          <div class="idoU">2024.02.20</div>
        </div>
        <div class="cim">Stábgyűlés</div>
        <div class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur eos ut quibusdam natus vel consequuntur ipsa maiores unde nesciunt id, sint nemo fugit non similique nisi quos voluptates assumenda consectetur.</div>
      </div>
    </div>
  </div>
  <div v-if="isAddPostActive" class="addPost" @click="addPost()" ref="addPostRef"><svg id="Layer_1" height="60" viewBox="0 0 24 24" width="60" fill ="white" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm1-11h4v2h-4v4h-2v-4h-4v-2h4v-4h2z"/></svg></div>
  <div class="addPostCont" ref="addPostCont" v-else>
    <div class="close"><svg @click="closeAddPost()" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 512.021 512.021" style="enable-background:new 0 0 512.021 512.021;" xml:space="preserve" width="20" height="20"><g><path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/></g></svg>
    </div>
    <div class="felirat">POSZT KÉSZÍTÉSE</div>
    <div class="input-container">
      <input type="text" id="input" required spellcheck="false" v-model="title">
      <label for="input" class="label">Cím</label>
      <div class="underline"></div>
    </div>
    <div class="felirat">SZÖVEG</div>
    <textarea v-model="content" class="txtarea" placeholder="Szöveg" ref="textarea" @input="resizeTextarea()"></textarea>
    <div class="felirat" style="margin-top: 30px;">TÖLTS FEL EGY KÉPET</div>
    <div class="file-upload-container">
      <label for="file-input" class="custom-file-label">
        Choose files
        <input 
          id="file-input" 
          type="file"
          multiple 
          @change="handleFiles" 
          class="file-input"
          accept="image/*"
        />
      </label>
      <ul class="file-list">
        <li v-for="(file, index) in selectedFiles" :key="index">
          {{ file.name }}
          <button @click="removeFile(index)" style="background-color: transparent; border: none;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="" viewBox="0 0 512.021 512.021" style="enable-background:new 0 0 512.021 512.021; fill: red; stroke: red; position: relative; top: 3px;" xml:space="preserve" width="15" height="15"><g><path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/></g></svg></button>
        </li>
      </ul>
    </div>
    <div style="display: flex; flex-direction: row;">
      <input type="checkbox" name="ertesites" id="ertesites" v-model="ertesites">
      <label for="ertesites">Mindenki értesítése(email)</label>
    </div>
    <div style="display: flex; flex-direction: row; ">
      <input type="checkbox" name="szavazas" id="szavazas" v-model="szavazas">
      <label for="szavazas">Szavazás készítése</label>
    </div>
    <div class="szavazasCont" v-if="szavazas">
      <div>a</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'stab'
});
const addPostCont = ref(null);
const addPostRef  = ref(null);
const isAddPostActive = ref(true);
const textarea = ref<HTMLTextAreaElement | null>(null);
  const content = ref('');
  const title = ref('');
  const ertesites = ref();
  const szavazas = ref();

  const selectedFiles = ref<File[]>([]);

// Function to handle file selection
const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    selectedFiles.value.push(...Array.from(input.files));
    console.log(selectedFiles.value);
  }
};


const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1); // Remove file at the specified index
};

const addPost = () => {
  isAddPostActive.value = false;
  setTimeout(() => {
    if (addPostCont.value) {
      addPostCont.value.classList.add('visible');
      addPostRef.value.classList.add('invisible');
    }
  }, 100); // Optional delay for smoother activation
};

const closeAddPost = () => {
  if (addPostCont.value) {
    title.value = '';
    content.value = '';   
    addPostCont.value.classList.remove('visible');
    setTimeout(() => {
      isAddPostActive.value = true;
      addPostRef.value.classList.remove('invisible');
    }, 500); // Wait for the transition to finish
  }
};

const resizeTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'; // Reset height to calculate new size
    textarea.value.style.height = `${textarea.value.scrollHeight}px`; // Adjust height
    if (textarea.value.scrollHeight >= 180) {
      textarea.value.style.overflow = 'auto';
    } else {
      textarea.value.style.overflow = 'hidden';
    }
  }
};


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.szavazasCont {

}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.custom-file-label {
  display: inline-block;
  padding: 12px;
  border: 2px dashed #007bff;
  border-radius: 6px;
  text-align: center;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
}

.custom-file-label:hover {
  background-color: #007bff;
  color: #fff;
}

.file-input {
  display: none; /* Hide the actual file input */
}

.file-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

}

.file-list li {
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}

.txtarea {
    resize: none;
    width: 70%;
    min-height: 50px;
    overflow: hidden; /* Hide scrollbars */
    resize: none; /* Prevent manual resizing */
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 15px;
  }

  .slideIn {
    animation: slideIn 1s forwards;
  }

  .slideOut {
    animation: slideOut 1s forwards;
  }

  @keyframes slideIn {
    to {
      top: 5vh;
      right: 10vw;
    }
  }
  @keyframes slideOut {
    to {
      top: 5vh;
      left: 100vw;
    }
  }

.close {
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: end;
}
.close > svg {
    cursor: pointer;
    transition: all 0.3s;
}
.close > svg:hover {
  fill: red;
}

.felirat {
  font-size: 30px;
  text-shadow: 2px 2px black;
}

.addPostCont {
  font-family: "Poppins", sans-serif;
  position: absolute;
  top: 5vh;
  left: 100vw;
  width: clamp(280px, 30vw, 800px);
  height: fit-content;
  min-height: 50vh;
  max-height: 88vh;
  border: 2px solid white;
  border-radius: 15px;
  padding: 20px;
  user-select: none;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
  transition: left 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  overflow-y: scroll;
  scroll-margin-right: -20px;
}

.addPostCont.visible {
  left: 40vw;
  opacity: 1;
}

@media (max-width: 768px) {
  .addPostCont.visible {
    left: 10vw; /* Adjust to 10vw on mobile */
  }
}

.addPost {
  position: fixed;
  right: 3vw;
  bottom: 5vh;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}

.addPost.invisible {
  scale: 0;
  opacity: 0;
}

.addPost:hover {
  box-shadow: rgba(17, 27, 209, 0.288) 0 0 3px 10px;
  background-color:rgba(17, 27, 209, 0.281);
  scale: 1.1;
}

.szavOpt {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
}

.szavazasFelirat {
  grid-column: span 3;
  font-size: 35px;
  font-family: "Poppins", monospace;
  user-select: none;
}

.voteCont {
  border: 2px solid white;
  width: 80%;
  min-height: 20vh;
  height: fit-content;
  border-radius: 20px;
  padding: 15px;
  display: grid;
  text-align: center;
  grid-template-columns: 3fr 9fr 1fr;
  justify-content: center;
  align-items: center;
}

.checkbtn {
  width: 20px;
  height: 20px;
}

.progressbar {
  width: 85%;
}

.kep {
  width:  75%;
  height: fit-content;
  border-radius: 10px;
  margin-bottom: 40px;
  margin-top: 20px;
}

.felsoCont {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.idoU, .szerzo {
  display: flex;
  width: 50%;
  user-select: none;
}

.idoU {
  justify-content: flex-end;
}

.contentUzenofal {
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-items: flex-start;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  padding-bottom: 10vh; 
  gap: 80px;
}

.contentUzenofal:first-child {
  margin-top: 30px;
}

.contentUzenofal:last-child {
  margin-bottom: 30px;
}

.contentUzenofal::-webkit-scrollbar, .addPostCont::-webkit-scrollbar {
  width: clamp(8px, 1vw, 15px);
  margin-left: 10px;
}
.contentUzenofal::-webkit-scrollbar-track, .addPostCont::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3); /* Track color */
  border-radius: 10px;
}

.contentUzenofal::-webkit-scrollbar-thumb, .addPostCont::-webkit-scrollbar-thumb {
  background-color: #66B2FF; /* Thumb color */
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3); /* Optional: gives a bordered look */
}

.content {
text-shadow: 2px 2px black;
}

.cim {
  text-shadow: 4px 4px black;
}


.uzenetCont {
  width: clamp(320px, 35vw, 1000px);
  border: 2px solid white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 5px 5px 10px 10px rgba(0, 0, 0, 0.3);
  user-select: text;
  break-after: always;
  line-break: normal;
  text-wrap:balance;
  transition: all 0.4s;
}

/* From Uiverse.io by Satwinder04 */ 
.input-container {
  position: relative;
  margin: 50px auto;
  width: 200px;
}

.input-container input[type="text"] {
  font-size: 20px;
  width: 100%;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 5px 0;
  background-color: transparent;
  outline: none;
}

.input-container .label {
  position: absolute;
  top: 0;
  left: 0;
  color: #ccc;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-container input[type="text"]:focus ~ .label,
.input-container input[type="text"]:valid ~ .label {
  top: -20px;
  font-size: 16px;
  color: #e8e8e8;
}

.input-container .underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: #e8e8e8;
  transform: scaleX(0);
  transition: all 0.3s ease;
}

.input-container input[type="text"]:focus ~ .underline,
.input-container input[type="text"]:valid ~ .underline {
  transform: scaleX(1);
}

</style>