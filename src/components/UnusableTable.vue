<template>
  <v-data-table 
  :search="search" 
  :headers="headers" 
  :items="unusablelist" 
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
        <td>{{ item.school_level}}</td>
        <td>{{ item.report_by	}}</td>
        <td>{{ item.description}}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.date_reported}}</td>

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
      unusablelist: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Category', key: 'category' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Reported By', key: 'report_by' },
        { title: 'Description', key: 'description' },
        { title: 'Item Quantity', key: 'quantity' },
        { title: 'Date Reported', key: 'date_reported' },
      ],     
      damagedItemData: {
      item_id: null,
      item_name: '',
      category: '',
      room_number: '',
      school_level: '',
      report_by: '',
      description: '',
      date_reported: '',
      quantity: 1,
    },
    };
},

mounted(){
this.getUnusableItems();
},

methods: {
  async getUnusableItems() {
    try {
      const response = await api.get('/unusable-items');
      this.unusablelist = response.data;
      console.log(this.unusablelist);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  },

},
}



</script>

<style lang="scss">

</style>