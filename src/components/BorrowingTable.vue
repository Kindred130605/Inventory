<template>

  <v-data-table
    :search="search"
    :headers="headers"
    :items="displayedStudents"
    :sort-by="[{ key: 'studentId', order: 'asc' }]"
    
    
  >
    <template v-slot:top >
      <v-toolbar flat >
        <v-toolbar-title class="text-h6 font-weight-black " style="color: #2F3F64"></v-toolbar-title>
        <!-- <v-divider class="mx-2" inset vertical></v-divider> -->

        <v-text-field
        v-model="search"
        class="w-auto mr-4 "
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
      
      </v-toolbar>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.Items }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.room_number }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.Course_name }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64" @click="editItem(item)">mdi-ques</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn class="text-h2" color="primary" @click="initialize">Reset</v-btn>
    </template> -->
  </v-data-table>
</template>

  <script>
  import api from '../service/axiosApi';
export default {
  
  data: () => ({
    search: '',
    borrowinglist: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Items', align: 'start', key: 'Items'} ,
      { title: 'Status', key: 'status' },
      { title: 'Room', key: 'room_number' },
      { title: 'Quantity', key: 'quantity' },
      { title: 'Course', sortable: 'Course_name' },
      { title: 'Actions', sortable: false },
    ],
    Items: [],
    editedIndex: -1,
    editedItem: {
      Items:'',
      status: '',
      room_number: '',
      quantity: '',
      Course_name: '',
    },
    defaultItem: {
      Items:'',
      status: '',
      room_number: '',
      quantity: '',
      Course_name: '',
    },
    
  }),

 mounted(){
  this.getBorrowers();
 },

 methods: {
    async getBorrowers() {
      try { 
        const response = await api.get('/borrowed-items');
        this.borrowinglist = response.data;
        console.log(this.borrowinglist);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },

  },
  
}


 
</script>

<style lang="scss">
.v-data-table {
  height: 100%;
}

   .table {
      max-height: 700vh;
    }

    .v-data-table {
      height: 100%;
    }
  </style>