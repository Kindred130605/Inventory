<template>
  <v-data-table 
  :search="search" 
  :headers="headers" 
  :items="itemsList" 
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
        <v-btn color="primary" variant="flat" dark @click="openDialog()">
          <v-icon left>mdi-plus</v-icon>
          ADD ITEM
        </v-btn>
      </v-toolbar>
    </template>


    <template v-slot:item= '{ item }'>
      <tr :key="item.id"  >
        <td >{{ item.item_name }}</td>
        <td>{{ item.item_quantity }}</td>
        <td>{{ item.category}}</td>
        <td>{{ item.unit_of_measure}}</td>
        <td>{{ item.room_number}}</td>
        <td style="padding:1rem;">{{ item.school_level}}</td>
        <td>{{ item.acceptedby}}</td>
        <td>{{ totalBorrowedQuantities[item.id] || 0}}</td>
        <td>{{ item.overdue_items || 0 }}</td>
        <td>{{ item.damaged_items || 0 }}</td>
        <td >

          <div class="icon-container">
          <v-icon @click="editItem(item)" style="color:blue">mdi-pencil</v-icon>
          <v-icon @click="openBorrowDialog(item)" style="color:green">mdi-handshake</v-icon>
          <v-icon @click="deleteItem(item)" style="color:red">mdi-delete</v-icon>
          </div>
          
        </td>
      </tr>
    </template>

  </v-data-table>

  <!-- Dialog for editing/adding items -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title v-if="editMode" class="fw-bold" style="padding:1rem;background-color: var(--dark); color:white; border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">edit</span>Edit Item</v-card-title>
      <v-card-title v-else class="fw-bold" style="padding:1rem;background-color: var(--dark); color:white; border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">add</span>Add Item</v-card-title>
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

  <v-dialog v-model="borrowDialog" max-width="600">
    <v-card>
      <v-card-title class="fw-bold" style="padding:1rem;background-color: var(--dark); color:white; border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">pending_actions</span>Borrow Item</v-card-title>
      <v-card-text>
        <v-text-field v-model="borrowersData.item_name" label="Item Name" :readonly="true"></v-text-field>
      <v-text-field v-model="borrowersData.student_id" label="Borrower" required></v-text-field>
      <v-text-field v-model="borrowersData.quantity" label="Quantity" required></v-text-field>
      <v-text-field v-model="borrowersData.adviser" label="Adviser" required></v-text-field>
      <v-select v-model="borrowersData.unit_of_measure" label="Unit of Measure" :items="chquantity"></v-select>
      <v-text-field v-model="borrowersData.borrow_date" label="Borrow Date" type="date" :readonly="true"></v-text-field>
      <v-text-field v-model="borrowersData.return_date" label="Return Date" type="date" :min="minReturnDate" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="borrowDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="borrowItem()">Borrow</v-btn>
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
        { title: 'Item Name', key: 'item_name'  },
        { title: 'Item Quantity', key: 'item_quantity' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Accepted By', key: 'acceptedby' },
        { title: 'Borrowed Items', key: 'borrowed_items' },
        { title: 'Overdue Items', key: 'overdue_items' },
        { title: 'Damanged Items', key: 'damaged_items' },
        { title: 'Action' },
      ],
      dialog: false,
      borrowDialog:false,
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
      borrowersData: {
        student_id: null,
        item_id: '',
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
      minReturnDate: '',
      studentsList: [],
    };
},

      
  mounted() {
    this.getItems();
    this.getStudents()
      },
  
  methods: {
     async getItems() {
      try {
        const [itemsResponse, borrowedResponse, overdueResponse, damagedResponse] = await Promise.all([
          api.get('/items'),
          api.get('/total-borrowed-quantity-per-item'),
          api.get('/total-overdue-quantities-per-item'),
          api.get('/total-damage-quantity-per-item')
        ]);

        this.itemsList = itemsResponse.data;
        this.totalBorrowedQuantities = borrowedResponse.data.reduce((acc, item) => {
          acc[item.item_id] = item.total_quantity;
          return acc;
        }, {});
        this.overdueQuantities = overdueResponse.data.reduce((acc, item) => {
          acc[item.item_id] = item.total_overdue;
          return acc;
        }, {});
        this.damagedQuantities = damagedResponse.data.reduce((acc, item) => {
          acc[item.item_id] = item.total_damaged;
          return acc;
        }, {});

        this.itemsList.forEach(item => {
          item.overdue_items = this.overdueQuantities[item.id] || 0;
          item.damaged_items = this.damagedQuantities[item.id] || 0;
        });

        this.checkLowStock();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    checkLowStock() {
      const lowStockItems = this.itemsList.filter(item => item.item_quantity <= 10);

      if (lowStockItems.length > 0) {
        const lowStockMessage = lowStockItems.map(item => `${item.item_name}: ${item.item_quantity} left`).join('<br>');
        Swal.fire({
          icon: 'warning',
          title: 'Low Stock Alert',
          html: `
            <p>The following items are low in stock:</p>
            <h5 >${lowStockMessage}</h5>
          `,
          confirmButtonText: 'OK'
        });
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
      this.getItems();
      this.dialog = true;
    },

    editItem(item) {
      this.editMode = true;
      this.itemsData = { ...item };
      this.dialog = true;
    },

   saveItem() {

    console.log('Payload:', this.itemsData);

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
              title: 'SUCCESS',
            icon: 'success',
            confirmButtonText: 'OK'
        });
          })
          .catch(error => {
            console.error('Error adding item:', error);
          });
      }
},

deleteItem(item) {
  // Show confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${item.item_name}. This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with deletion if confirmed
      api.post(`/items/delete/${item.id}`)
        .then(response => {
          let i = this.itemsList.findIndex(i => i.id === item.id);
          if (i !== -1) {
            this.itemsList.splice(i, 1);
            // Show success message
            Swal.fire({
              title: 'Deleted!',
              text: 'The item has been deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            console.error('Item not found in itemList');
          }
        })
        .catch(error => {
          console.error('Error deleting item:', error);
          // Show error message
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem deleting the item. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  });
},

openBorrowDialog(item) {
      this.borrowersData = {
        ...item,
        item_id: item.id,
        borrow_date: new Date().toISOString().split('T')[0],
        return_date: '',
        quantity: 1,
        student_id: '',
        status: 'Borrowed',
        unit_of_measure: '',
        adviser:'',
        acceptedby:null
      };
      this.setReturnDateMin();
      this.borrowDialog = true;
    },
    borrowItem() {
      if (!this.borrowersData.student_id || !this.borrowersData.return_date) {
        Swal.fire('Error!', 'All fields are required.', 'error');
        this.borrowDialog=false;
        return;
        
      }

      if (this.borrowersData.quantity > this.borrowersData.item_quantity) {
        Swal.fire('Error!', 'Not enough stock available.', 'error');
        this.borrowDialog=false;
        return;
      }

      api.post('/borrowed-items', this.borrowersData)
        .then(response => {
          Swal.fire({
            icon: 'success',
            title: 'Item Borrowed',
            confirmButtonText: 'OK'
          });
          this.getItems()
          this.borrowDialog = false;
        })
        .catch(error => {
          console.error('Error borrowing item:', error);
          this.borrowDialog = false;
        });
    },

    setReturnDateMin() {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      this.minReturnDate = now.toISOString().split('T')[0];
    },
    
    async getStudents() {
  try { 
        const response = await api.get('http://192.168.1.29:8000/api/student');
        this.studentsList = response.data;
        console.log(this.studentsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
}
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
.v-table__wrapper{
  color: black;
  padding: 1.5rem;
  
  .v-data-table__th {
    font-size: 17px;
    font-weight: 800;

  }


}
.icon-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .v-icon{
    font-size: 28px;
  }
}


</style>