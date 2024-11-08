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
          <input type="radio" name="checkbtn" id="checkbtn" class="checkbtn">
          <div class="szavOpt">Option2</div>
          <progress class="progressbar" max="100" min="0" value="15"></progress>
          <input type="radio" name="checkbtn" id="checkbtn" class="checkbtn">
          <div class="szavOpt">Option3</div>
          <progress class="progressbar" max="100" min="0" value="15"></progress>
          <input type="radio" name="checkbtn" id="checkbtn" class="checkbtn">
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
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'stab'
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


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

.contentUzenofal::-webkit-scrollbar {
  width: 8px;
  margin-left: 10px;
}
.contentUzenofal::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3); /* Track color */
  border-radius: 10px;
}

.contentUzenofal::-webkit-scrollbar-thumb {
  background-color: #66B2FF; /* Thumb color */
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3); /* Optional: gives a bordered look */
}

.uzenetCont {
  min-width: 35vw;
  max-width: 35vw;
  border: 2px solid white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: justify;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 5px 5px 10px 10px rgba(0, 0, 0, 0.3);
  user-select: text;
}
</style>