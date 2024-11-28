<template>
  <div class="container-fluid">
    <div class="row text-center pt-5 mt-5 pb-5  ">
      <div class="col d-flex justify-content-center">
        <div class="card rounded-4 text-center pt-5 ">
          <h3 class="text-white">Form Login</h3>
          <div class="card-body d-flex justify-content-center m-3 pt-5 bungkusan rounded-3">
            <form @submit.prevent="log">
              <label for="exampleInputEmail"></label>
              <input v-model="email" type="email" class="form-control form-control-lg rounded-3 akn text-center"
                id="exampleInputEmail" placeholder="Email">
              <label for="exampleInputPassword"></label>
              <input v-model="password" type="password" class="form-control form-control-lg rounded-3 akn text-center"
                id="exampleInputPassword" placeholder="Password">
              <button class="btn btn-success m-3" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center ps">
    </div>
  </div>
</template>

<script setup>

const supa = useSupabaseClient()
const email = ref('')
const password = ref('')

async function log() {
  const { data, error } = await supa.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (!error) {
    navigateTo('/home')
  } else {
    alert('Email or Password Invalid')
  }
}
</script>

<style scoped>
.card-body{
  background-color: rgb(154, 155, 156);
}

.card {
  background-color: rgb(83, 83, 83)
}

.btn-success{
  background-color: black;
}
</style>
