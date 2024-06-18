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

    <v-row dense >
      <v-col v-for="room in rooms" :key="room.id" :cols="4">
        <v-card class="mx-auto" max-width="500">
          <v-img src="src/assets/SNA Logo with BG.png" class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" />
          <v-card-actions>
            <v-card-title v-text="room.rooms_num"></v-card-title>
            <v-spacer />
            <v-btn color="#F50057" variant="flat" dark @click="deleteRoom(room)">DELETE</v-btn>
            <v-btn color="primary" variant="flat" dark @click="openDialogView(room)">VIEW</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <v-dialog v-model="addDialog" max-width="600">
    <v-card>
      <v-card-title>Add Room</v-card-title>
      <v-card-text>
        <v-text-field v-model="roomsData.rooms_num" label="Room Name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="addDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="saveRoom()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-dialog v-model="viewDialog" max-width="600" max-height="1000">
    <v-card>
      <v-card-title>View Room</v-card-title>
      <v-card>
        <v-container dense>
          Room items
        </v-container>
      </v-card>

      <v-card-text>
        <v-select :item-props="itemSelect" :items="items" label="ITEMS">
        </v-select>
        <v-text-field  label="Input field">
        </v-text-field>
        <v-btn color="blue darken-1" @click="addItemToRoom">ADD ROOM ITEM</v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="viewDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="saveRoom">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import api from '../service/axiosApi';

  export default {
    data (){
          return {
              search: '',
            rooms: [],
            items: [],
            roomsData: {
              rooms_num: ''
            },
            addDialog: false,
            viewDialog: false,
            selected: 'NONE',
            inputValue: '',
          };
    },

mounted() {
  this.getRooms();
  this.getItems();
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

         async getItems() {
      try {
        const response = await api.get('/items');
        this.items = response.data;
        console.log(this.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
        },

      openDialog() {
        this.addDialog = true;
        this.roomsData = {
          rooms_num: '',
        };
      },

      saveRoom() {
        api.post('/rooms/add', this.roomsData).then(response => {
          this.rooms.push({ ...this.roomsData });
          this.addDialog = false;
        })
      },

      deleteRoom(room) {
        api.post(`/rooms/delete/${room.id}`)
          .then(response => {
            let i = this.rooms.findIndex(i => i.id === room.id);
            if (i !== -1) {
              this.rooms.splice(i, 1);
            } else {
              console.error('Item not found in itemList');
            }
          })
          .catch(error => {
            console.error('Error deleting rooms:', error);
          });

          
      },

     openDialogView(room) {
      this.viewDialog = true;
    },

    itemSelect (item) {
        return {
          title: item.items_name,
          subtitle: item.items_quantity,
        }
      },

    updateInput() {
      this.inputValue = this.selectedItem || '';
    },


    addItemToRoom() {
      console.log(`Item added: ${this.inputValue}`);
    },
   
   
  
  },

  computed: {
    filteredItems() {
      return this.items.filter(item => {
        return item.items_name.toLowerCase().includes(this.search.toLowerCase());
      });
    },

    

    
}

  }

</script>

<style>

</style>