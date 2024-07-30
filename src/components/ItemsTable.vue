<template>
  <v-data-table :search="search" :headers="headers" :items="itemsList" :sort-by="[{ key: 'items_name', order: 'asc' }]">
    <!-- toolbar  -->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title 
        class="text-h6 font-weight-black" 
        style="color: #2F3F64">
      </v-toolbar-title>

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
    >
  </v-text-field>

        <v-btn color="primary" variant="flat" dark @click="openDialog()">
          <v-icon left>mdi-plus</v-icon>
          ADD ITEM
        </v-btn>
      </v-toolbar>
    </template>


    <template v-slot:item= '{ item }'>
      <tr :key="item.id">
        <td>{{ item.item_name }}</td>
        <td>{{ item.item_quantity }}</td>
        <td>{{ item.category}}</td>
        <td>{{ item.unit_of_measure}}</td>
        <td>{{ item.room_number}}</td>
        <td>{{ item.school_level}}</td>
        <td>{{ item.acceptedby}}</td>
        <td>{{ item.borrowed_items}}</td>
        <td>{{ item.overdue_items}}</td>
        <td>{{ item.damaged_items}}</td>
        <td>
          <v-icon @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon @click="borrowItem(item)">mdi-handshake</v-icon>
          <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>

  </v-data-table>

  <!-- Dialog for editing/adding items -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title v-if="editMode">Edit Item</v-card-title>
      <v-card-title v-else>Add Item</v-card-title>
      <v-card-text>
        <v-text-field v-model="itemsData.item_name" label="Item Name"></v-text-field>
        <v-text-field v-model="itemsData.item_quantity" label="Item Quantity" type="number"></v-text-field>
        <v-select v-model="itemsData.category" label="Category" :items="chmeasure"></v-select>
        <v-select v-model="itemsData.unit_of_measure" label="Unit of Measure" :items="chquantity"></v-select>
        <v-text-field v-model="itemsData.room_number" label="Room Number"></v-text-field>
        <v-select v-model="itemsData.school_level" label="School Level" :items="chschool"></v-select>
        <v-text-field v-model="itemsData.acceptedby" label="Accepted By"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1"  @click="saveItem()">Save</v-btn>
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
      chmeasure:['Classroom', 'Office Items', 'Library Items', 'Science Lab Items', 'Art Room Items', 'Music Room Items', 'Gymnasium and Sports Items', 'Cafeteria Items', 'Maintenance Items', 'Playground Item', 'Miscellaneous Items'],
      chquantity:['Sets', 'Pieces', 'Packs Items', 'Kits'],
      chschool:['Junior High School', 'Senior High School'],
      itemsList: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Item Quantity', key: 'item_quantity' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Accepted By', key: 'acceptedby' },
        { title: 'Borrowed Items', key: 'borrowed_items' },
        { title: 'Overdue Items', key: 'overdue_items' },
        { title: 'Damanged Items', key: 'damaged_items' },
      ],
      dialog: false,
      editMode: false,
      itemsData: {
      id: null,
      item_name: '',
      item_quantity: 0,
      category:'',
      unit_of_measure:'',
      room_number:'',
      school_level:'',
      acceptedby:'',
      },

    };
},

      
  mounted() {
    this.getItems();
      },
  
  methods: {
     async getItems() {
      try {
        const response = await api.get('/items');
        this.itemsList = response.data;
        console.log(this.itemsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },

    openDialog() {
      this.editMode = false;
      this.itemsData = {
      id: null,
      item_name: '',
      item_quantity: 0,
      category:'',
      unit_of_measure:'',
      room_number:'',
      school_level:'',
      acceptedby:'',
      };
      this.dialog = true;
    },

    editItem(item) {
      this.editMode = true;
      this.itemsData = { ...item };
      this.dialog = true;
    },

   saveItem() {
  if (this.editMode) {
    api.post(`/items/update/${this.itemsData.id}`, this.itemsData)
      .then(response => {
        let i = this.itemsList.findIndex(item => item.id === this.itemsData.id);
        if (i !== -1) {
         this.itemsList.splice(i, 1, { ...this.itemsData });
          this.dialog = false;
        }
      })
      .catch(error => {
        console.error('Error updating item:', error);
      });
  } else {
        const conflictItem = this.itemsList.find(item => (
          item.item_name.toLowerCase() === this.itemsData.item_name.toLowerCase() &&
          item.category.toLowerCase() === this.itemsData.category.toLowerCase() &&
          item.unit_of_measure.toLowerCase() === this.itemsData.unit_of_measure.toLowerCase() &&
          item.school_level.toLowerCase() === this.itemsData.school_level.toLowerCase() &&
          item.room_number.toString().toLowerCase() === this.itemsData.room_number.toString() &&
          item.acceptedby.toLowerCase() === this.itemsData.acceptedby.toString()
        ));

        if (conflictItem) {
          Swal.fire('Duplicate!', 'An item with the same details already exists. You should check it first', 'error');
          this.dialog = false;
          return
        }
        api.post('/items/add', this.itemsData)
          .then(response => {
            this.itemsList.push({ ...this.itemsData });
            this.dialog = false;
            Swal.fire({
            icon: 'success ',
            title: 'SUCCESS',
            confirmButtonText: 'OK'
        });
          })
          .catch(error => {
            console.error('Error adding item:', error);
          });
      }
},

 deleteItem(item) {
  api.post(`/items/delete/${item.id}`)
    .then(response => {
      let i = this.itemsList.findIndex(i => i.id === item.id);
      if (i !== -1) {
        this.itemsList.splice(i, 1);
      } else {
        console.error('Item not found in itemList');
      }
    })
    .catch(error => {
      console.error('Error deleting item:', error);
    });
},
borrowItem(){
               Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
              });
},
    
  },


      computed: {
        filteredItems() {
          return this.itemsList.filter(item => {
            return item.item_name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.item_quantity.toString().includes(this.search);
          });
        }
}
      
};
</script>



<style lang="scss">
      .table {
      }

      .v-data-table {
      }
</style>