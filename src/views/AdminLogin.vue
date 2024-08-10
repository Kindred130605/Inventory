<template >
  <v-app class="app">
      <v-container class=" fill-height" fluid>
        <v-row align="center" justify="center" >
          <v-col cols="12" sm="8" md="8" >
            <v-card class="elevation-12">
              <v-window v-model="step">
                  <v-row>
                    <v-col cols="12" md="5" class="rectangle-color">
                      
                      <v-card-text class="white--text mt-16 pt-14 mx-auto">
                        <div class="logo-container">
                        <!-- Logo positioned at the right side -->
                        <img src="/src/assets/schoolLogo3.png" max-height="900" max-width="900" class="logo">
                      </div>
                      <div class="text-container text-center">
                        <h1 class="mt-10 h2 font-weight-black">ST.NICHOLAS ACADEMY OF CASTILLEJOS INC.</h1>
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
                          Welcome to  <span class="sna-text">SNACI</span>
                        </h2>
                        <h4 class="text-center pt-0 fs-6">
                          Inventory Panel - ADMIN PORTAL
                        </h4>
                        <v-form>
                          <v-text-field 
                            label="Email/ID"
                            name="Email"
                            prepend-icon="mdi-email"
                            type="text"
                            color="var(--dark)"
                            />
                          <v-text-field
                            id="password"
                            label="Password"
                            name="Password"
                            prepend-icon="mdi-lock"
                            type="password"
                            color="var(--dark)"
                            />
                        </v-form> 
                      </v-card-text>
                      <div class="text-center pb-2 mx-md-auto">
                        <v-btn rectangle color="var(--dark)"> <router-link to="/dashboard" style="color:white; text-decoration: none; width: auto; font-size: 15px; ">Login</router-link></v-btn>
                      </div>
                      <div class="text-center pb-2">
                        <a href="" style="display: inline-block;">
                          St. Nicholas Academy General Privacy Notice
                        </a>
                      </div>
                    </v-col>
                  </v-row>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
</template>
<script>
import api from '../services/api.js';
 export default {
    data: () => ({
      step: 1
    }),
    props: {
      source: String
    },
    methods: {
       async login() {
  const loginCredentials = new FormData();

  loginCredentials.append('email', this.email);
  loginCredentials.append('password', this.password);

  try {
    const response = await api.post('login', loginCredentials);
    if (response.status === 200) {
      console.log(response.data);
      sessionStorage.setItem('token', response.data.access_token);

      this.$router.push('/dashboard');
      
      Swal.fire({
      title: 'Login Successful',
      icon: 'success',
      timer: 2000,
      toast: true,
      width:'20rem',
      timerProgressBar: true,
      position: 'top-end',
      showConfirmButton: false, 
      });

    }
  } catch (error) {
    if (error.response) {
      // Server responded with an error status code
      if (error.response.status === 401) {
        // Unauthorized: Incorrect email or password
        Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Incorrect email or password'
            });      
          } 
          else {
            // Other server errors
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid credentials. Please try again.'
            });
          }
        } else {
          // Network or client-side errors
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'An error occurred while logging in'
          });
        }
      }        
    }
    }
  }
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
</style>

