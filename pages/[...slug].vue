<template>
  <div class="container">
    <div class="cont">
      <h1 class="error-code">404</h1>
      <div class="error-message">Az oldal <span>{{ route.fullPath }}</span> nem található!</div>
      <NuxtLink to="/" class="backtohome">Vissza a főoldalra</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    height: 100vh;
    background-color: rgb(75, 75, 75); /* Kept your grey background */
    overflow: hidden;
    color: white;
  }
</style>

<style scoped>
/* Container for centering content */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  animation: fadeIn 1.5s ease-in-out;
}

/* Main error container */
.cont {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  width: 50vw;
  max-width: 500px;
  height: fit-content;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  animation: popUp 1s ease-out;
  background-color: transparent;
}

/* Error code styling */
.error-code {
  font-size: 6rem;
  color: #ff6666;
  margin: 0;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* Error message styling */
.error-message {
  font-size: 1.4rem;
  margin-bottom: 26px;
  color: #e0e0e0;
  z-index: 2;
}

.error-message span {
  color: #ff6666;
  text-decoration: underline;
  font-weight: bold;
}

/* Back to home button styling */
.backtohome {
  margin-top: 20px;
  font-size: 1.5rem;
  padding: 10px 20px;
  color: #ffffff;
  background-color: #ff6666;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.backtohome:hover {
  background-color: #ff4747;
}

/* Animations */
@keyframes popUp {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Media query for mobile */
@media (max-width: 768px) {
  .cont {
    width: 80vw;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-message {
    font-size: 1.2rem;
  }

  .backtohome {
    font-size: 1.3rem;
  }
}
</style>
