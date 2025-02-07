<template>
  <div>
    <div class="contentMain">
      <div class="infoCont">
        <div class="cim">{{ poszt?.cim }}</div>
        <div class="content2">{{ poszt?.content }}</div>
        <div class="ido">{{ poszt?.ido }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type kiirasClient = {
  cim: string;
  content: string;
  ido: string;
};

const poszt = ref<kiirasClient | null>(null);

  const formatDate = (year:number, month:number, day:number) => {
  const date = new Date(year, month, day);
  const formatteddate = date.toLocaleDateString('hu-HU', {
    year: 'numeric',
  month: 'long', // Short month (e.g., "Jan")
  day: '2-digit'  // Day with leading zero if needed (e.g., "01")
});
  return formatteddate;
}

poszt.value = {
  cim: 'Fontos információk',
  content: `Diáknap: Április 16. \n Témánk: Élmények \n Témavilág: Társasjátékok \n`,
  ido: formatDate(2021, 3, 10)
};



definePageMeta({
layout: 'new'
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.txtarea {
  resize: none;
  width: 70%;
}

.contentMain {
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

.contentMain:first-child {
  margin-top: 30px;
}

.contentMain:last-child {
  margin-bottom: 30px;
}

.contentMain::-webkit-scrollbar {
  width: 8px;
  margin-left: 10px;
}

.contentMain::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.contentMain::-webkit-scrollbar-thumb {
  background-color: #66B2FF;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.infoCont {
  min-width: 30%;
  min-height: 20%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.3);
  flex-direction: column;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 60vw;
  max-height: max-content;
  font-size: clamp(16px, 3vw, 300px); /* Responsive font size */
}

.ido {
  width: 100%;
  text-align: end;
  position: relative;
  height: fit-content;
  user-select: none;
  color: rgb(168, 168, 168);
  font-size: clamp(14px, 1.5vw, 20px); /* Responsive font size */
}

.cim {
  font-size: clamp(24px, 4vw, 480px); /* Responsive font size */
  font-family: "Poppins", sans-serif;
  margin-bottom: 15px;
  user-select: none;
  color: rgb(224, 224, 224);
}

.content2 {
  font-size: clamp(16px, 2vw, 36px); /* Responsive font size */
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  margin-bottom: 10px;
  word-wrap: wrap;
  white-space: pre-line;
  color: rgb(206, 206, 206);
}
</style>