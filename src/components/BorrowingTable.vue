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
        <tr :key="item.item_id">
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

          <td >
            <div class="icon-container">

            <v-icon @click="returnItem(item)" style="color:green; font-size:25px;">mdi-thumb-up</v-icon>
            <v-icon @click="openDamageDialog(item)" style="color:red; font-size:25px;">mdi-account-hard-hat</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>


    <v-dialog v-model="damageDialog" max-width="600">
      <v-card>
        <v-card-title class="fw-bold" style="padding:1.2rem;background-color: var(--dark); color:white; border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">construction</span>Return with Damage</v-card-title>
        <v-card-text>
              <v-text-field 
              v-model="damagedItemData.report_by" 
              label="Reported By*" 
              readonly>
              </v-text-field>

              <v-textarea
              v-model="damagedItemData.description"
              label="Description"
              required
              auto-grow
            ></v-textarea>        
          </v-card-text>
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
          { title: 'Action', },
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
        report_by: '',
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
        item_id: item.item_id,
        report_by: item.borrower, // Set the reported_by from the borrower
        description: '', // Start with an empty description
        date_reported: new Date().toISOString(), // Set the current date/time

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
    
    this.getBorrowers();

    Swal.fire('Success', 'Item returned successfully', 'success');
  } catch (error) {
    console.error('Error returning item:', error);
    Swal.fire('Error', 'Failed to return item', 'error');
  }
},
  
async returnWithDamage() {
    // Validation checks
    if (!this.damagedItemData.report_by || !this.damagedItemData.description) {
      Swal.fire('Error!', 'All fields are required.', 'error');
      return; // Prevent further execution
    }

    try {
      // Prepare API payload
      const payload = {
        item_id: this.damagedItemData.item_id,
        report_by: this.damagedItemData.report_by,
        description: this.damagedItemData.description,
        date_reported: new Date().toISOString().split('T')[0], // Set report date to today
      };

      // Make API request to save damaged item
      await api.post('/damaged-items', payload);

      // Update the item status in the list
      const item = this.borrowinglist.find(i => i.item_id === this.damagedItemData.item_id);
      if (item) {
        item.status = 'Returned with Damage';
        item.return_date = new Date().toISOString().split('T')[0]; // Set return date to today
      }

      // Optionally, refresh the list to reflect changes
      this.getBorrowers();

      Swal.fire({
        icon: 'success',
        title: 'Item Marked as Damaged',
        confirmButtonText: 'OK'
      });

      // Close the dialog
      this.damageDialog = false;
    } catch (error) {
      console.error('Error marking item as damaged:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was a problem marking the item as damaged. Please try again later.',
        confirmButtonText: 'OK'
      });
      this.damageDialog = false; // Close the dialog in case of error
    }
  }
  },
}

</script>

<style lang="scss">

</style>