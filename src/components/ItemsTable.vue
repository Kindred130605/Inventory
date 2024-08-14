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
      <v-btn  color="primary" style="margin: 10px;" variant="flat"  dark 
    @click="openDialog()"
    class="tooltip-button"
    data-bs-toggle="tooltip" 
    data-bs-placement="bottom" 
    data-bs-title="ADD ITEM"
  >
          <v-icon left>mdi-plus</v-icon>
          ADD ITEM
        </v-btn>
        <v-btn color="primary" variant="flat" dark @click="downloadXLS()" class="tooltip-button"
    data-bs-toggle="tooltip" 
    data-bs-placement="bottom" 
    data-bs-title="DOWNLOAD EXCELL">
          <v-icon left>mdi-download</v-icon>
          DOWNLOAD EXCELL
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
         <v-btn @click="editItem(item)" style="color:blue" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Update Items"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn @click="openBorrowDialog(item)" style="color:green" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Borrow Items"><v-icon>mdi-handshake</v-icon></v-btn>
          <v-btn @click="deleteItem(item)" style="color:red" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete Items"><v-icon>mdi-delete</v-icon></v-btn>
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
        <v-autocomplete
  v-model="borrowersData.student_id"
  :items="studentsList"
  item-text="title" 
  item-value="student_id"
  label="Student"
  clearable
  required
></v-autocomplete>


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
import ExcelJS from 'exceljs';

export default {
 
  data() {
    return {
      search: '',
      chmeasure:['Classroom Items', 'Office Items', 'Library Items', 'Science Lab Items', 'Art Room Items', 'Music Room Items', 'Gymnasium and Sports Items', 'Cafeteria Items', 'Maintenance Items', 'Playground Item', 'Miscellaneous Items'],
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
        student_id: '',
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
    this.getStudents();
    this.$nextTick(() => {
      this.initializeTooltips();
    });
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

    initializeTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
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
          Swal.fire({
              title: 'SUCCESS',
            icon: 'success',
        });
        }
      })
      .catch(error => {
        console.error('Error updating item:', error);
        Swal.fire({
              title: 'Error Updating',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
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
        api.post('/items/add', toLowerCase(this.itemsData))
          .then(response => {
            this.itemsList.push({ ...this.itemsData });
            this.dialog = false;
            this.getItems()
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
    const response = await api.get('http://26.81.173.255:8000/api/student');
    console.log(response); 
    this.studentsList = response.data.student.map(student => ({
      student_id: student.student_id,
      title: student.student_id 
    }));
    console.log(this.studentsList); 
  } catch (error) {
    console.error('Error fetching items:', error);
  }

},

async convertExcel(data) {
  const excel = new ExcelJS.Workbook();
  const worksheet = excel.addWorksheet("Items");

  try {
    // Fetch image and convert to base64
    const imageResponse = await fetch('/src/assets/schoolLogo3.png');
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await this.blobToBase64(imageBlob); 

    const logo = excel.addImage({
      base64: imageBase64,
      extension: 'png'
    });

    worksheet.addImage(logo, {
      tl: { col: 0, row: 0 },
      ext: { width: 180, height: 120 },
      editAs: 'absolute'
    });

    worksheet.addImage(logo, {
      tl: { col: 7, row: 0 },
      ext: { width: 180, height: 120 },
      editAs: 'absolute'
    });


    worksheet.mergeCells('A2:J2');
    worksheet.getCell('A2').value = 'Saint Nicholas Academy';
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { size: 16, bold: true };

    worksheet.addRow(); 

    worksheet.mergeCells('A3:J3');
    worksheet.getCell('A3').value = 'Address';
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A3').font = { size: 12 };

    worksheet.mergeCells('A4:J4');
    worksheet.getCell('A4').value = 'Contact No';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 12 };

    worksheet.addRow(); // Add an empty row for separation

    // Add column headers
    worksheet.addRow([
      'Item Name',
      'Item Quantity',
      'Category',
      'Unit Of Measure',
      'Room Number',
      'School Level',
      'Accepted By',
      'Borrowed Items',
      'Overdue Items',
      'Damaged Items'
    ]);

    // Add data rows
    data.forEach(item => {
      worksheet.addRow([
        item.item_name,
        item.item_quantity,
        item.category,
        item.unit_of_measure,
        item.room_number,
        item.school_level,
        item.acceptedby,
        item.borrowed_items,
        item.overdue_items,
        item.damaged_items
      ]);
    });

    return excel; // Return the excel workbook
  } catch (error) {
    console.error('Error in convertExcel:', error);
  }
},

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Split to get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  async downloadXLS() {
    try {
      const data = this.itemsList; // Or any other data you want to export
      const excel = await this.convertExcel(data); // Make sure convertExcel is awaited

      if (excel instanceof ExcelJS.Workbook) {
        const buffer = await excel.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Inventory.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire({
          title: 'Download Success!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        console.error('Invalid ExcelJS.Workbook instance');
      }
    } catch (error) {
      console.error('Error downloading XLS:', error);
    }
  },

},
      computed: {
        filteredItems() {
          return this.itemsList.filter(item => {
            return item.item_name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.item_quantity.toString().includes(this.search) || item.acceptedby.toLowerCase().includes(this.search.toLowerCase());
          });
        }
},
watch: {
  itemsList() {
    this.$nextTick(() => {
      this.initializeTooltips();
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
  gap: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .v-icon{
    font-size: 28px;
  }
}

.tooltip-button {
  position: relative;
}


</style>