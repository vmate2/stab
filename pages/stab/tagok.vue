<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
layout: 'stab'
});

const newStaff = {
    vnev: 'John',
    knev: 'Doe',
    dob: '1990-01-01',
    stabcash: 50000,
    userid: 'john_doe',
    acclvl: 1,
    kezeltsponzorok: 'some text here',
    email: 'john.doe@example.com',
    phone: '1234567890',
    pfp: 'profile-image-url',
    last_login: '2024-01-01 12:00:00',
    bio: 'Some text bio',
    school: 'Békéscsaba High',
    assigned_tasks: '{"task1": "description"}',
    city: 'Békéscsaba',
    attendance: '[{"date":"2024-04-01", "status":"present"}]',
    last_updated: Math.floor(Date.now() / 1000)
  };


  const result = await $fetch('/api/server', {
    method: 'POST',
    body: {
      type: 'addStabtag',
      data: newStaff
    }
  });

  if (result) {
    console.log(result);
  }
</script>

<style>

</style>