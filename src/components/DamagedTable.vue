<template>
  <v-data-table 
  :search="search" 
  :headers="headers" 
  :items="damagelist" 
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
        <td>{{ item.report_by	}}</td>
        <td>{{ item.description}}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.date_reported}}</td>
        <td>{{ item.adviser}}</td>

        <td>
          <div class="icon-container">

          <v-icon @click="returnItem(item)" style="color:green">mdi-clipboard-arrow-left</v-icon>
          <v-icon @click="unusableItem(item)" style="color:red">mdi-alert-decagram</v-icon>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import api from '../service/axiosApi.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
 
  data() {
    return {
      search: '',
      damagelist: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Reported By', key: 'report_by' },
        { title: 'Description', key: 'description' },
        { title: 'Item Quantity', key: 'quantity' },
        { title: 'Date Reported', key: 'date_reported' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Action' },
      ],     
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
this.getDamagedItems();
},

methods: {
  async getDamagedItems() {
    try {
      const response = await api.get('/damaged-items');
      this.damagelist = response.data;
      console.log(this.damagelist);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  },


  async returnItem(item) {
  try {
    // Ensure the request payload matches the backend validation rules
    await api.post('/damaged-items/repair', {
      item_id: item.item_id, // Ensure this field is correct
      quantity: item.quantity, // Ensure this field is correct
    });

    // Update local state to remove the repaired item
    this.damagelist = this.damagelist.filter(d => d.item_id !== item.item_id);

    this.getDamagedItems();

    Swal.fire('Success', 'Item repaired successfully', 'success');
  } catch (error) {
    console.error('Error repairing item:', error);
    Swal.fire('Error', 'Failed to repair item', 'error');
  }
},

async unusableItem(item) {
    try {
      await api.post('/unusable-items', {
        item_id: item.item_id,
        item_name: item.item_name,
        category: item.category,
        unit_of_measure: item.unit_of_measure,
        room_number: item.room_number,
        school_level: item.school_level,
        report_by: item.report_by,
        description: item.description,
        date_reported: item.date_reported,
        adviser: item.adviser,
        quantity: item.quantity,
      });

      // Optionally remove or update the item from the list
      this.damagelist = this.damagelist.filter(d => d.item_id !== item.item_id);

      Swal.fire('Success', 'Item marked as unusable successfully', 'success');
    } catch (error) {
      console.error('Error marking item as unusable:', error);
      Swal.fire('Error', 'Failed to mark item as unusable', 'error');
    }
  }

},
}



</script>

<style lang="scss">

</style>