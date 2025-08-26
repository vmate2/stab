<template>

    <div class="gameContainer">
      <div
        class="game"
        v-for="(game, index) in games"
        :key="index"
        :style="{
          backgroundImage: `url(/img/${game.name}.jpg)`
        }"
        @click="openGame(game.name)"
      >{{ game.name }}</div>
    </div>
  <div class="recentWinnersContainer">
    <div class="recentWinnersTitle">Legutóbbi nyertesek</div>
    <div class="recentWinner">vmate - 5000</div>
    <div class="recentWinner">jánoska - 12000</div>
    <div class="recentWinner">xyz - 2500</div>
    <div class="recentWinner">kucsa dávid - 10000</div>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
	layout: 'casino'
})

const { user, loading, error, fetchCurrentUser } = useCurrentUser()

onMounted(async () => {
  await fetchCurrentUser()
  console.log(user.value);
  
})

const games = [
  {  name: 'Poker' },
  {  name: 'Blackjack' },
  {  name: 'Roulette' },

]

const openGame = async (game:string) => {
  console.log(game);
  await navigateTo(`/kaszino/games/${game}`)
  
}


</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');


.mainBg { 
  background-color: rgb(70, 0, 0);
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  position: fixed;
  overflow: hidden;
}

.topBar {
  width: 100dvw;
  height: 10%;
  background-color: rgb(39, 39, 39);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}


.profileContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
  cursor: pointer;
}

.username {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-family: 'Montserrat', sans-serif;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  text-shadow: 3px 3px black;
}

.profilePic {
  width: 50px;
  height: 50px;
  background-color: darkred;
  border-radius: 50%;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.username.loading,
.profilePic.loading {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.username.loading {
  width: 150px;
  height: 25%;
  border-radius: 6px;
}

.profilePic.loading {
  width: 50px;
  height: 50px;
  margin: auto;
  border-radius: 50%;
}

.title {
  font-family: 'Montserrat', sans-serif;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
}

.title > span {
  color: green;
}

.title {
  color: red;
}

.title > strong {
  color: gold;
}

.settings {
  width: 35px;
  height: 35px;
  margin-left: 1%;
  cursor: pointer;
}

.topBar > div {
  transition: all 0.3s ease;
}

/* Settings ikon hover */
.settings:hover {
  transform: rotate(90deg) scale(1.1);
  filter: drop-shadow(0 0 5px gold);
}

/* Title hover */
.title:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  cursor: pointer;
}

/* Profile hover */
.profileContainer:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.recentWinnersContainer {
  position: fixed;
  top: 15%;
  left: 1%;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Montserrat', sans-serif;
}

.recentWinnersTitle {
  font-size: 1rem;
  font-weight: 700;
  color: gold;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
  width: 100%;
}

.recentWinner {
  width: 100%;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.recentWinner:nth-child(2) { animation-delay: 0.1s; }
.recentWinner:nth-child(3) { animation-delay: 0.2s; }
.recentWinner:nth-child(4) { animation-delay: 0.3s; }
.recentWinner:nth-child(5) { animation-delay: 0.4s; }
.recentWinner:nth-child(6) { animation-delay: 0.5s; }
.recentWinner:nth-child(7) { animation-delay: 0.6s; }
.recentWinner:nth-child(8) { animation-delay: 0.7s; }
.recentWinner:nth-child(9) { animation-delay: 0.8s; }
.recentWinner:nth-child(10) { animation-delay: 0.9s; }

/* hover glow */

@media screen and (max-width: 850px) {
  .recentWinnersContainer {
    display: none;
  }
}

@media screen and (max-width: 600px) {

  .title {
    display: none;
  }
}

.gameContainer {
  width: 72%;
  height: auto;
  max-height: 78%;
  border-radius: 15px;
  margin: auto;
  margin-top: 2.5%;

  display: flex;
  flex-wrap: wrap;       /* több sorba törhetnek */
  justify-content: center; /* balra rendezés alapból */
  align-items: flex-start;     /* függőlegesen középre */
  gap: 1rem;
  padding: 1%;
}

.game {
  width: 300px;
  aspect-ratio: 16 / 9;  
  border: 2px solid black;
  border-radius: 12px;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: rgb(255, 255, 255);
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.9),
    -2px -2px 4px rgba(0, 0, 0, 0.9);
  text-rendering: geometricPrecision;
  -ms-text-size-adjust: auto;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  cursor: pointer;
}


.game:hover {
  width: calc(300px + 20px);
}


@media screen and (max-width: 850px) {
  .gameContainer {
    justify-content: center;
    overflow-y: scroll;
  }
}



.balanceCont {
  width: 150px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid black;
  border-radius: 16px;
  box-shadow: inset 2px 2px 3px 1px black;
  display: flex;
  align-items: center;
}

.balance {
  font-family: 'Montserrat', sans-serif;
  color: rgb(226, 226, 226);
  font-weight: 600;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  margin-left: 5%;
}

.tokenSVG {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* fade-in from bottom */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}


/* shimmer keyframes */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}



</style>