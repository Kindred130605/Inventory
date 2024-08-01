<template>
    <v-data-table 
    :search="search" 
    :headers="headers" 
    :items="borrowinglist" 
    :sort-by="[{ key: 'items_name', order: 'asc' }]">
      <!-- toolbar  -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="text-h6 font-weight-black" style="color: #2F3F64"></v-toolbar-title>
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
  
  
      <template v-slot:item= '{ item }'>
        <tr :key="item.id">
          <td>{{ item.item_name }}</td>
          <td>{{ item.category}}</td>
          <td>{{ item.unit_of_measure}}</td>
          <td>{{ item.room_number}}</td>
          <td>{{ item.school_level}}</td>
          <td>{{ item.borrower}}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.borrow_date}}</td>
          <td>{{ item.return_date}}</td>
          <td>{{ item.status}}</td>
          <td>{{ item.adviser}}</td>

          <td style="padding: 30px; text-align:center;">
            <v-icon @click="returnItem(item)" style="color:green; font-size:25px;">mdi-checkbox-marked-circle</v-icon>
            <v-icon @click="openDamageDialog(item)" style="color:red; font-size:25px;">mdi-alert-circle</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>


    <v-dialog v-model="damageDialog" max-width="600">
      <v-card>
        <v-card-title>Damaged Item</v-card-title>
        <v-card-text>
              <v-text-field 
              v-model="damagedItemData.reported_by" 
              label="Reported By*" 
              required>
              </v-text-field>

              <v-textarea
              v-model="damagedItemData.description"
              label="Description"
              required
              auto-grow
            ></v-textarea>        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="damageDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" @click="returnWithDamage(item)">Return</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

  <script>
  import api from '../service/axiosApi.js';
  import Swal from 'sweetalert2';
  import 'sweetalert2/dist/sweetalert2.min.css';
  export default {
   
    data() {
      return {
        search: '',
        borrowinglist: [],
        headers: [
          { title: 'Item Name', key: 'item_name' },
          { title: 'Category', key: 'category' },
          { title: 'Unit Of Measure', key: 'unit_of_measure' },
          { title: 'Room Number', key: 'room_number' },
          { title: 'School Level', key: 'school_level' },
          { title: 'Borrower', key: 'borrower' },
          { title: 'Quantity', key: 'quantity' },
          { title: 'Borrow Date', key: 'borrow_date' },
          { title: 'Return Date', key: 'return_date' },
          { title: 'Status', key: 'status' },
          { title: 'Adviser', key: 'adviser' },
          { title: 'Action' },
        ],     
        dialog: false,
        damageDialog: false,

        borrowersData: {
        item_id: null,
        item_name: '',
        category: '',
        unit_of_measure: '',
        room_number: '',
        school_level: '',
        borrower: '',
        borrow_date: '',
        return_date: '',
        status: 'Borrowed',
        adviser: '',
        quantity: 1,
      },
        damagedItemData: {
        item_id: null,
        item_name: '',
        category: '',
        unit_of_measure: '',
        room_number: '',
        school_level: '',
        reported_by: '',
        description: '',
        date_reported: '',
        adviser: '',
        quantity: 1,
      },
      };
  },

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

    openDamageDialog(item) {
      this.damagedItemData = {
        reported_by:'',
        description:'',
      };
      this.damageDialog = true;
    },

    async returnItem(item) {
  try {
    // Ensure the request payload matches the backend validation rules
    await api.post('/borrowed-items/return', {
      item_id: item.item_id, // Ensure this field is correct
      quantity: item.quantity, // Ensure this field is correct
    });

    // Update local state
    item.status = 'Returned'; // or handle the removal from the list
    item.return_date = new Date().toISOString().split('T')[0]; // Set return date to today

    Swal.fire('Success', 'Item returned successfully', 'success');
  } catch (error) {
    console.error('Error returning item:', error);
    Swal.fire('Error', 'Failed to return item', 'error');
  }
},
  
async returnWithDamage(item) {
  try {
    await api.post('/damaged-items', {
      item_id: item.id, // Ensure this matches your backend's expected field
      status: 'Returned with Damage', // Ensure this field is handled correctly by the backend
      quantity: item.quantity, // Send the quantity of the item being returned
      date_reported: new Date().toISOString(), // Send the current date/time in ISO format
      report_by: 'User Name', // Include the user or person reporting the damage
      description: 'Item was damaged during use.', // Provide a description of the damage
    });

    // Update local state
    item.status = 'Returned with Damage';
    Swal.fire('Success', 'Item marked as damaged successfully', 'success');
  } catch (error) {
    console.error('Error marking item as damaged:', error);
    Swal.fire('Error', 'Failed to mark item as damaged', 'error');
  }
},
  },
}

</script>

<style lang="scss">

</style>