<template>
  <v-data-table :search="search" :headers="headers" :items="itemsList" :sort-by="[{ key: 'items_name', order: 'asc' }]">
    <!-- toolbar  -->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="text-h6 font-weight-black" style="color: #2F3F64">Items</v-toolbar-title>
        <v-text-field v-model="search" class="w-auto mr-4" label="Search" prepend-inner-icon="mdi-magnify"
          variant="outlined" dense hide-details single-line></v-text-field>
        <v-btn color="primary" variant="flat" dark @click="openDialog()">
          <v-icon left>mdi-plus</v-icon>
          ADD ITEM
        </v-btn>
      </v-toolbar>
    </template>
    <!-- end -->

    <!-- table config -->
    <template v-slot:item= '{ item }'>
      <tr :key="item.id">
        <td>{{ item.item_name }}</td>
        <td>{{ item.item_quantity }}</td>
        <td>{{ item.category}}</td>
        <td>{{ item.unit_of_measure}}</td>
        <td>{{ item.room_number}}</td>
        <td>{{ item.school_level}}</td>
        <td>{{ item.acceptedby}}</td>
        <td>{{ item.items_needed}}</td>
        <td>{{ item.borrowed_items}}</td>
        <td>{{ item.overdue_items}}</td>
        <td>{{ item.damaged_items}}</td>
        <td>
          <v-icon @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon @click="editItem(item)">mdi-handshake</v-icon>
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
        <v-text-field v-model="itemsData.items_name" label="Item Name"></v-text-field>
        <v-text-field v-model="itemsData.items_quantity" label="Item Quantity" type="number"></v-text-field>
        <v-text-field v-model="itemsData.type" label="Item Quantity" type="number"></v-text-field>
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

export default {
  data() {
    return {
      search: '',
      itemsList: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Item Quantity', key: 'item_quantity' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Accepted By', key: 'acceptedby' },
        { title: 'Items Needed', key: 'items_needed' },
        { title: 'Borrowed Items', key: 'borrowed_items' },
        { title: 'Overdue Items', key: 'overdue_items' },
        { title: 'Damanged Items', key: 'damaged_items' },
      ],
      dialog: false,
      editMode: false,
      itemsData: {
      id: null,
      items_name: '',
      items_quantity: 0
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
        items_name: '',
        items_quantity: 0
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
    api.post('/items/add', this.itemsData)
      .then(response => {
        this.itemsList.push({ ...this.itemsData });
        this.dialog = false;
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
}
    
  },


      computed: {
        filteredItems() {
          return this.itemsList.filter(item => {
            return item.items_name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.items_quantity.toString().includes(this.search);
          });
        }
}
      
};
</script>



    <style lang="scss">
      .table {
        max-height: 700vh;
      }

      .v-data-table {
        height: 100%;
      }
    </style>