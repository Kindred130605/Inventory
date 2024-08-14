<template>
    <aside :class="`${is_expanded && 'is_expanded'}`">
        <img class="sna-logo" src="/src/assets/SNA Logo with BG.png" alt="">
        <h2 class="sp-text">Welcome <br> Admin</h2>
        <br>
        <hr>
        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu"> 
                <span class="material-icons">keyboard_double_arrow_right</span> 
            </button>
        </div>
        <div class="menu">
            <router-link class="button" to="/dashboard">
                <span class="material-icons">home</span>
                <span class="text">Dashboard</span>
            </router-link>
            <router-link class="button" to="/items">
                <span class="material-icons">inventory</span>
                <span class="text">Items</span>
            </router-link>
            <router-link class="button" to="/borrowing">
                <span class="material-icons">pending_actions</span>
                <span class="text">Borrowing</span>
            </router-link>
            <router-link class="button" to="/damaged">
                <span class="material-icons">construction</span>
                <span class="text">Damaged Items</span>
            </router-link>
            <router-link class="button" to="/unusable">
                <span class="material-icons">dangerous</span>
                <span class="text">Unusable Items</span>
            </router-link>
        </div>
        <button class="menu-logout" @click="logout">
            <span class="material-icons">logout</span>
            <span class="text">Logout</span>
        </button>
    </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const router = useRouter()

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem("is_expanded", is_expanded.value.toString())
}

const logout = async () => {
    const result = await Swal.fire({
        title: 'Confirm Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#808080',
        confirmButtonText: 'Yes, logout'
    })

    if (result.isConfirmed) {
        try {
            sessionStorage.clear()
            localStorage.removeItem("token")
            router.push('/login')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }
}
</script>

  <style lang="scss" scoped>
   aside {
  display: flex;
  flex-direction: column;
  width: calc(2.5rem + 32px);
  min-height: 100vh;
  overflow: hidden;
  padding: 1rem;
  background-color: var(--dark);
  color: var(--light);
  position: -webkit-sticky;
  position: sticky;
  transition: 0.2s ease-out;
     
      .sna-logo {
        height: 2.5rem;
        width: 2.5rem;
        transition: 0.2s ease-out;
        border-radius: 1.1rem;
      }

      .sp-text{
        display: none;
        transition: 0.2s ease-out;
      }
      .menu-toggle-wrap {
          display: flex;
          justify-content: flex-end;
  
          position: relative;
          bottom: 0.5rem;
          transition: 0.2s ease-out;
  
          margin: 5px;
          .menu-toggle {
              transition: 0.2s ease-out;
              .material-icons{
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover {
                  .material-icons {
                      color: var(--primary);
                      transform: translateX(0.5rem);
                  }
              }
          }
      }
       .button .text {
          opacity: 0;
          transition: 0.3s ease-out;
      }
  
  
      .menu {
          margin: -0 -1rem;
          position: relative;
          bottom: 0.5rem;
          .button{
              display: flex;
              align-items: center;
              text-decoration: none;
  
              padding: 0.8rem 1rem;
              margin-bottom: 0.5rem;
              transition: 0.2s ease-out;
              .material-icons {
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              .text{
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover, &.router-link-exact-active{
                  background-color: #fff;
                  margin-left: 0.5rem;
                  border-top-left-radius: 20px;
                  border-bottom-left-radius: 20px;
                  .material-icons, .text {
                      color: var(--dark);
                  }
              }
          }

          .dropdown {
            padding: 0.8rem 1rem;
            transition: 0.2s ease-out;

            .dropbtn{
                .material-icons {
                        font-size: 2rem;
                        color: var(--light);
                        transition: 0.2s ease-out;

                }

                .text{
                    opacity: 0;
                    transition: 0.2s ease-out;

                }

                &:hover{
                  margin-left: 0.3rem;
                  transition: 0.2s ease-out;

                }
            }   
            .dropdown-content a {
                color: var(--light);
                padding: 1rem 5.3rem 1rem ; 
                margin-bottom: 0.5rem;
                text-decoration: none;
                display: flex;
                transition: background-color 0.3s ease;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                transition: 0.2s ease-out;
              
              &:hover, &.router-link-active{
                background-color: #fff;
                margin-left: 0.5rem;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                transition: 0.2s ease-out;
                color: var(--dark);
              }
              .material-icons{
                font-size: 2rem;
                position: relative;
                right: 75px;
                transition: 0.2s ease-out;

            }
            
            .text{
                opacity: 0;
                transition: 0.2s ease-out;
            }
              }
            
              .fade-enter-active, .fade-leave-active {
                transition: opacity 0.3s;
              }
              
              .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
                opacity: 0;
              }
          }
      }
  
      .menu-logout {
          margin: -0 -1rem ;
          transition: 0.2s ease-out;
          flex: 1;
          display: flex;
          align-items: flex-end;
          .button{
              display: flex;
              align-items: center;
              text-decoration: none;
  
              padding: 0.8rem 1rem;
              margin-bottom: 0.5rem;
              transition: 0.2s ease-out;
              .material-icons {
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              .text{
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover{
                  .material-icons, .text {
                      color: var(--primary);
                  }
              }
          }
      }
      &.is_expanded {
          width: var(--sidebar-width);
  
          .menu-logout{
              display: flex;
              align-items: flex-end;
              margin: -0 2rem ;
              transition: 0.2s ease-out;
              color: var(--light);
  
          }
          .sna-logo{
                height: 9rem;
                width: 9rem;
                transition: 0.2s ease-out;
                align-self: center;
                border-radius: 5rem;
          }

          .sp-text {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #fff;
            opacity: 1;
            display: block;
            transition: 0.2s ease-out;
            text-align: center;
          }
  
          .menu-toggle-wrap {
              top:-4rem;
              left: 0.5rem;
              .menu-toggle{
                  transform: rotate(-180deg);
              }
              
          }
          .button .text {
              opacity: 1;
          }
          
          .button {
              .material-icons {
                  margin-right: 1rem;
              }
          }
          .dropdown {
            position: relative;
            align-items: center;
            text-decoration: none;
            padding: 0.8rem 1rem;
            transition: 0.2s ease-out;

            .dropbtn{
                
                .material-icons {
                    font-size: 2rem;
                    color: var(--light);
                    transition: 0.2s ease-out;
                    position: relative;
                    top: 10px;
                }

                .text{
                    color: var(--light);
                    transition: 0.2s ease-out;
                    margin-left: 1rem;
                    opacity: 1;
                }
            }  
             
            .dropdown-content a {
                position: relative;
                top: 1rem;
                left: 1rem;
                color: var(--light);
                padding: 1rem 4rem 0.7rem ; 
                margin-bottom: 0.5rem;
                text-decoration: none;
                display: flex;
                transition: background-color 0.3s ease;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                transition: 0.2s ease-out;
             
              
              &:hover, &.router-link-exact-active {
                background-color: #fff;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                transition: 0.2s ease-out;
                color: var(--dark);
              }

              .material-icons{
                font-size: 2rem;
                position: relative;
                right: 30px;
                transition: 0.2s ease-out;

            }
            
            .text{
                position: relative;
                right: 30px;
                transition: 0.2s ease-out;
                margin-left: 1rem;
                opacity: 1;
            }
              }
            
              .fade-enter-active, .fade-leave-active {
                transition: opacity 0.3s;
              }
              
              .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
                opacity: 0;
              }
          }
          .menu {
            bottom: 2.5rem;
          }
          
          .hr{
            position: relative;
            bottom: 2rem;
          }
        
        }

        @media (max-width: 1050px){
          .menu-toggle-wrap{
            opacity: 0;
            pointer-events: none;
          }
        }
    }
  </style>