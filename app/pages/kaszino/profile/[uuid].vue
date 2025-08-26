<template>
		<div class="profileDetails">
			<h2 class="profileTitle">Profil</h2>
			<div v-if="user" class="profileInfo">
				<div class="infoRow"><span class="label">Teljes név:</span> <span>{{ user.fullName }}</span></div>
				<div class="infoRow"><span class="label">E-mail:</span> <span>{{ user.email }}</span></div>
				<div class="infoRow"><span class="label">Felhasználónév:</span> <span>{{ user.username }}</span></div>
				<div class="infoRow"><span class="label">Egyenleg:</span> <span>{{ user.balance }}</span></div>
			</div>
			<div v-else class="profileInfo loading">Betöltés...</div>
		</div>
</template>

<script lang="ts" setup>

definePageMeta({
	layout: 'casino'
})

import { useCurrentUser } from '@/composables/currentUser'
const { user, loading, error, fetchCurrentUser, fetchUser } = useCurrentUser()
onMounted(async () => {
	await fetchCurrentUser()
})
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
	overflow: auto;
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
.title {
	font-family: 'Montserrat', sans-serif;
	color: white;
	font-weight: 600;
	font-size: 1.5rem;
	letter-spacing: 0.5px;
}
.title > span { color: green; }
.title { color: red; }
.title > strong { color: gold; }
.settings { width: 35px; height: 35px; margin-left: 1%; cursor: pointer; }
.profileDetails {
	margin: 3% auto;
	width: 90%;
	max-width: 500px;
	background: rgba(0,0,0,0.4);
	border-radius: 16px;
	box-shadow: 2px 2px 10px 4px black;
	padding: 2rem;
	color: white;
	font-family: 'Montserrat', sans-serif;
}
.profileTitle {
	color: gold;
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
	text-align: center;
	text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
}
.profileInfo {
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
	font-size: 1.2rem;
}
.infoRow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(255,255,255,0.05);
	border-radius: 8px;
	padding: 0.7rem 1.2rem;
}
.label {
	color: gold;
	font-weight: 600;
}
@media screen and (max-width: 600px) {
	.title { display: none; }
	.profileDetails { padding: 1rem; font-size: 1rem; }
	.profileTitle { font-size: 1.3rem; }
}
</style>
