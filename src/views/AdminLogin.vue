<template>
  <v-app class="app">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8">
          <v-card class="elevation-12">
            <v-row>
              <v-col cols="12" md="5" class="rectangle-color">
                <v-card-text class="white--text mt-16 pt-14 mx-auto">
                  <div class="logo-container">
                    <!-- Logo positioned at the right side -->
                    <img src="/src/assets/schoolLogo3.png" max-height="900" max-width="900" class="logo">
                  </div>
                  <div class="text-container text-center">
                    <h1 class="mt-10 h2 font-weight-black">ST. NICHOLAS ACADEMY OF CASTILLEJOS INC.</h1>
                    <p class="h6 font-weight-normal">CASTILLEJOS, ZAMBALES</p>
                  </div>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="7">
                <v-card-text class="mt-1">
                  <div class="text-center mb-1">
                    <img src="/src/assets/schoolLogo.png" class="logo-logo">
                  </div>
                  <h2 class="text-center lh-0 fs-4 fw-normal">
                    Welcome to <span class="sna-text">SNACI</span>
                  </h2>
                  <h4 class="text-center pt-0 fs-6">
                    Inventory Panel - ADMIN PORTAL
                  </h4>
                  <v-form>
                    <label for="email">Email/ID</label> 
                    <v-text-field 
                      v-model="email"
                      id="email" 
                      label="Email/ID"
                      name="email" 
                      prepend-icon="mdi-email"
                      type="text"
                      color="var(--dark)"
                    />

                    <label for="password">Password</label>
                    <v-text-field
                      v-model="password"
                      id="password" 
                      label="Password"
                      name="password" 
                      prepend-icon="mdi-lock"
                      type="password"
                      color="var(--dark)"
                    />
                  </v-form>
                </v-card-text>
                <div class="text-center pb-2 mx-md-auto">
                  <v-btn class="login-button" rectangle color="var(--dark)" @click="login">Login</v-btn>
                </div>s
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import auth from '../service/auth.js';
import store from '../store'; 

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const loginCredentials = new FormData();
      loginCredentials.append('email', this.email);
      loginCredentials.append('password', this.password);

      try {
        const response = await auth.post('login', loginCredentials);
        if (response.status === 200) {
          console.log(response.data);
          store.dispatch('login', response.data.access_token);

          this.$router.push('/dashboard');

          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            timer: 2000,
            toast: true,
            width: '20rem',
            timerProgressBar: true,
            position: 'top-end',
            showConfirmButton: false,
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Incorrect email or password'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid credentials. Please try again.'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'An error occurred while logging in'
          });
        }
      }
    }
  }
};
</script>



<style scoped> 

  .app {
    position: relative; /* Ensure the parent is positioned relative */
    background-image: url('../assets/BG.jpg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .app::before {
    content: ''; /* Required for pseudo-elements */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); /* Adjust the opacity value as needed */
  }

  .logo-container {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 300px;
      height: 100%;
      right: 100%; /* Adjust this value to move the container to the left */
  }

  
  .logo {
    width: 600px; 
    height: 100%; 
    object-fit: cover; 
    filter: brightness(250%) grayscale(0%); 
    opacity: 12%;
  }

    .logo-logo {
    max-height: 150px;
    max-width: 150px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .sna-text{
    color: var(--dark);
    text-shadow: 0px 1px, 1px 0px, 1px 1px;
  }
  .text-container {
    position: relative;
    z-index: 1; 
    color: white;
  }
  .rectangle-color{
    background-color: var(--dark);
  }

.login-button {
  color: white;
  text-decoration: none;
  width: auto;
  font-size: 15px;
}


</style>