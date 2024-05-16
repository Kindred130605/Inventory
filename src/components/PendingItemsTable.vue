<template>
<<<<<<< Updated upstream
    <v-data-table
      :search="search"
      :headers="headers"
      :items="displayedStudents"
      :sort-by="[{ key: 'studentId', order: 'asc' }]"
      
      
    >
      <template v-slot:top >
        <v-toolbar flat >
          <v-toolbar-title class="text-h6 font-weight-black " style="color: #2F3F64">Maintenance</v-toolbar-title>
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
        
          <v-dialog v-model="dialog" max-width="1000px">
            
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2 rounded-l	" color="primary" dark v-bind="props" prepend-icon="mdi-plus">Add Room</v-btn>
            </template>
            
            <v-card >
              <v-card-title ><span class="text-h6 m-2" style="color: #2F3F64"  >{{ formTitle }}</span></v-card-title>
              <v-card-text > 
                <v-container >
                  <v-row dense >
                    <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.student_lrn"
                      label="LRN*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email Address*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                  cols="12"
                  md="4"
                  sm="6"
                  ></v-col>
  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.first_name"
                      label="First Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.middle_name"
                      hint="example of helper text only on focus"
                      label="Middle Name"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.last_name"
                      label="Last Name*"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="1"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.extension"
                      label="Extension Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-select
                      v-model="editedItem.sex_at_birth"
                      :items="['Male', 'Female', 'Other']"
                      label="Sex*"
                      required
                    ></v-select>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.birth_date"
                      label="Birthdate*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.birth_place"
                      label="Birthplace*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-select
                      v-model="editedItem.civil_status"
                      :items="['Single','Married','Divorced']"
                      label="Civil Status*"
                      required
                    ></v-select>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.citizenship"
                      label="Citizenship*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.religion"
                      label="Religion*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.street"
                      label="Street*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.barangay"
                      label="Barangay*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.city"
                      label="City*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.province"
                      label="Provice*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.region"
                      label="Region*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.zip_code"
                      label="Zip Code*"
                      required
                    ></v-text-field>
                  </v-col>
                  
            </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.extension }}</td>
          <td>{{ item.student_id }}</td>
          <td>{{ item.student_lrn }}</td>
          <td>{{ item.grade_level }}</td>
          <td>{{ item.strand }}</td>
          <td>
            <v-icon class="me-2" size="small" style="color: #2F3F64" @click="editItem(item)">mdi-pencil</v-icon>
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
  
  export default {
    
    data: () => ({
=======
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
    <template v-slot:item="{ item }">
      <tr :key="item.id">
        <td>{{ item.items_name }}</td>
        <td>{{ item.items_quantity }}</td>
        <td>
          <v-icon @click="editItem(item)">mdi-pencil</v-icon>
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
        <v-text-field v-model="editedItem.items_name" label="Item Name"></v-text-field>
        <v-text-field v-model="editedItem.items_quantity" label="Item Quantity" type="number"></v-text-field>
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
import api from '../service/axiosApi';

export default {
  data() {
    return {
>>>>>>> Stashed changes
      search: '',
      itemsList: [],
      headers: [
        { title: 'Item Name', key: 'items_name' },
        { title: 'Item Quantity', key: 'items_quantity' }
      ],
      dialog: false,
      editMode: false,
      editedItem: {
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
      this.editedItem = {
        id: null,
        items_name: '',
        items_quantity: 0
      };
      this.dialog = true;
    },

    editItem(item) {
      this.editMode = true;
      this.editedItem = { ...item };
      this.dialog = true;
    },

   saveItem() {
  if (this.editMode) {
    api.post(`/items/update/${this.editedItem.id}`, this.editedItem)
      .then(response => {
        let i = this.itemsList.findIndex(item => item.id === this.editedItem.id);
        if (i !== -1) {
          this.itemsList.splice(i, 1, response.data);
          this.dialog = false;
        }
      })
      .catch(error => {
        console.error('Error updating item:', error);
      });
  } else {
    api.post('/items/add', this.editedItem)
      .then(response => {
        const newItem = response.data;
        this.itemsList.push(newItem);
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