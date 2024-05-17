<template>
  <v-card>
  <v-toolbar>
     <v-toolbar-title class="text-h6 font-weight-black" style="color: #2F3F64">Rooms</v-toolbar-title>
        <v-text-field v-model="search" class="w-auto mr-4" label="Search" prepend-inner-icon="mdi-magnify"
          variant="outlined" dense hide-details single-line></v-text-field>
        <v-btn color="primary" variant="flat" dark @click="openDialog()">
          <v-icon left>mdi-plus</v-icon>
          ADD Rooms
        </v-btn>
  </v-toolbar>

    <v-row dense>
      <v-col v-for="room in rooms" :key="room.title" :cols="4">
        <v-card class="mx-auto" max-width="500">
          <v-img
            src="src/assets/SNA Logo with BG.png"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
            :loading="loading"
          />
          <v-card-actions>
                   <v-card-title v-text="room.rooms_num"></v-card-title>
            <v-spacer />
            <v-btn color="primary" variant="flat" dark>VIEW</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import api from '../service/axiosApi';

  export default {
    data (){
          return {
              search: '',
              rooms: [],
             
          };
    },

mounted() {
    this.getRooms();
    },
    methods: {
     async getRooms() {
      try {
        const response = await api.get('/rooms');
        this.rooms = response.data;
        console.log(this.rooms);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
        },


        
    },

      computed: {
        filteredItems() {
          return this.rooms.filter(item => {
            return rooms.rooms_num.toLowerCase().includes(this.search.toLowerCase()) 
          });
        }
}

  }

</script>

<style>

</style>