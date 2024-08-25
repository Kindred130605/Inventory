<template>
  <v-data-table :headers="headers" :items="filteredItems" :sort-by="[{ key: 'items_name', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="text-h6 font-weight-black" style="color: #2F3F64"></v-toolbar-title>
        
        <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search" 
        prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line></v-text-field>
        
        <v-select v-model="searchColumn" :items="searchableColumns" label="Search by column" 
        density="compact" variant="solo-filled" flat></v-select>
        
        <v-btn color="primary" style="margin: 10px;"
         variant="flat" dark @click="openAddDialog()" class="tooltip-button" data-bs-toggle="tooltip" 
         data-bs-placement="bottom" data-bs-title="ADD ITEM">
          <v-icon left>mdi-plus</v-icon>
          ADD ITEM
        </v-btn>
        
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" style="margin: 10px;" variant="flat" dark v-bind="props">
              GENERATE REPORT <v-icon right>mdi-download</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="prepareReport('PDF')">
              <v-icon left>mdi-download</v-icon>
              PDF
            </v-list-item>
            <v-list-item @click="prepareReport('EXCEL')">
              <v-icon left>mdi-download</v-icon>
              EXCEL
            </v-list-item>
          </v-list>
        </v-menu>

      </v-toolbar>
    </template>


    <template v-slot:item="{ item }">
      <tr :key="item.id">
        <td>{{ item.item_name }}</td>
        <td>{{ item.item_quantity }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.unit_of_measure }}</td>
        <td>{{ item.room_number }}</td>
        <td>{{ item.school_level }}</td>
        <td>{{ item.acceptedby }}</td>
        <td>{{ totalBorrowedQuantities[item.id] || 0 }}</td>
        <td>{{ item.overdue_items || 0 }}</td>
        <td>{{ item.damaged_items || 0 }}</td>
        <td>
          <div class="icon-container">
            <v-btn @click="editItem(item)" style="color:blue" class="tooltip-button" data-bs-toggle="tooltip"
              data-bs-placement="bottom" data-bs-title="Update Items">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="openBorrowDialog(item)" style="color:green" class="tooltip-button" data-bs-toggle="tooltip"
              data-bs-placement="bottom" data-bs-title="Borrow Items">
              <v-icon>mdi-handshake</v-icon>
            </v-btn>
            <v-btn @click="deleteItem(item)" :disabled="totalBorrowedQuantities[item.id] > 0" :style="{ color: totalBorrowedQuantities[item.id] > 0 ? 'grey' : 'red' }"
              class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete Items">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </td>
      </tr>
    </template>

  </v-data-table>

  <!-- Dialog for adding items -->
  <v-dialog v-model="addDialog" max-width="600">
    <v-card>
      <v-card-title class="fw-bold" style="padding:1rem;background-color: var(--dark); color:white; 
      border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">add
      </span>Add Item</v-card-title>
      <v-card-text>
        <v-text-field v-model="itemsData.item_name" label="Item Name" ></v-text-field>
        <v-text-field v-model="itemsData.item_quantity" label="Item Quantity" type="number"></v-text-field>
        <v-combobox
            v-model="itemsData.category"
            :items="chmeasure"
            label="Category"
            clearable
            return-object
            dense
        ></v-combobox>
        <v-select v-model="itemsData.unit_of_measure" label="Unit of Measure" :items="chquantity"></v-select>
        <v-text-field v-model="itemsData.room_number" label="Room Number"></v-text-field>
        <v-select v-model="itemsData.school_level" label="School Level" :items="chschool"></v-select>
        <v-text-field v-model="itemsData.acceptedby" label="Custodian"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="addDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" :disabled="!addValidation" @click="saveItem()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog for updating items -->
  <v-dialog v-model="editMode" max-width="600">
    <v-card>
      <v-card-title class="fw-bold" style="padding:1rem;background-color: var(--dark); color:white; 
      border-radius:3px;"><span class="material-icons" style="position:relative; right:5px; top:5px;">edit
      </span>Update Item</v-card-title>
      <v-card-text>
        <v-text-field v-model="itemsData.item_name" label="Item Name" :readonly="true"></v-text-field>
        <v-text-field v-model="itemsData.item_quantity" label="Item Quantity" type="number"></v-text-field>
        <v-combobox
            v-model="itemsData.category"
            :items="chmeasure"
            label="Category"
            clearable
            return-object
            dense
            :readonly="true"
        ></v-combobox>
        <v-select v-model="itemsData.unit_of_measure" label="Unit of Measure" :items="chquantity" 
        :readonly="true"></v-select>
        <v-text-field v-model="itemsData.room_number" label="Room Number" :readonly="true"></v-text-field>
        <v-select v-model="itemsData.school_level" label="School Level" :items="chschool" :readonly="true"
        ></v-select>
        <v-text-field v-model="itemsData.acceptedby" label="Custodian" :readonly="true"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="saveItem()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="borrowDialog" max-width="600">
    <v-card>
      <v-card-title class="fw-bold"
        style="padding:1rem;background-color: var(--dark); color:white; border-radius:3px;"><span class="material-icons"
          style="position:relative; right:5px; top:5px;">pending_actions</span>Borrow Item</v-card-title>
      <v-card-text>
        <v-text-field v-model="borrowersData.item_name" label="Item Name" :readonly="true"></v-text-field>
        <v-autocomplete v-model="borrowersData.student_id" :items="studentsList" item-text="title"
          item-value="student_id" label="Student" clearable required></v-autocomplete>
        <v-text-field v-model="borrowersData.quantity" label="Quantity" required></v-text-field>
        <v-text-field v-model="borrowersData.adviser" label="Adviser" :readonly="true"></v-text-field>
        <v-text-field v-model="borrowersData.borrow_date" label="Borrow Date" type="date"
          :readonly="true"></v-text-field>
        <v-text-field v-model="borrowersData.return_date" label="Return Date" type="date" :min="minReturnDate"
          required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="borrowDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" :disabled="!isValid" @click="borrowItem()">Borrow</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add a dialog for filtering -->
  <v-dialog v-model="filterDialog" max-width="500">
    <v-card>
      <v-card-title>Filter Report</v-card-title>
      <v-card-text>
        <v-form ref="filterForm">
          <v-combobox v-model="filter.category" :items="chmeasure" label="Category"></v-combobox>
          <v-select v-model="filter.unitOfMeasure" :items="chquantity" label="Unit of Measure"></v-select>
          <v-select v-model="filter.roomNumber" :items="roomNumbers" label="Room Number"></v-select>
          <v-select v-model="filter.schoolLevel" :items="chschool" label="School Level"></v-select>
          <v-select v-model="filter.acceptedBy" :items="acceptedBy" label="Custodian"></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="generateReport()">Generate Report</v-btn>
        <v-btn color="error" @click="filterDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '../service/axiosApi.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      search: '',
      searchColumn: 'item_name',
      searchableColumns: ['item_name', 'category', 'unit_of_measure', 'room_number', 'school_level',
       'acceptedby'],
      chmeasure: ['Classroom Items', 'Office Items', 'Science Lab Items', 'Art Room Items', 'Music Room Items', 'Gymnasium and Sports Items', 'Cafeteria Items', 'Maintenance Items', 'Playground Item', 'Miscellaneous Items'],
      chquantity: ['Sets', 'Pieces', 'Packs', 'Kits'],
      chschool: ['Junior High School', 'Senior High School'],
      itemsList: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Item Quantity', key: 'item_quantity' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Custodian', key: 'acceptedby' },
        { title: 'Borrowed Items', key: 'borrowed_items' },
        { title: 'Overdue Items', key: 'overdue_items' },
        { title: 'Damanged Items', key: 'damaged_items' },
        { title: 'Action' },
      ],
      addDialog: false,
      borrowDialog: false,
      editMode: false,

      itemsData: {
        id: null,
        item_name: '',
        item_quantity: 0,
        category: '',
        unit_of_measure: '',
        room_number: '',
        school_level: '',
        acceptedby: '',
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

      filter: {
        category: null,
        unitOfMeasure: null,
        roomNumber: null,
        schoolLevel: null,
        acceptedBy: null
      },
      filterDialog: false,
      reportType: ''
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

        this.$nextTick(() => {
          this.initializeTooltips();
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

    openAddDialog() {
      this.editMode = false;
      this.itemsData = {
        id: null,
        item_name: '',
        item_quantity: 0,
        category: '',
        unit_of_measure: '',
        room_number: '',
        school_level: '',
        acceptedby: '',
      };
      this.getItems();
      this.addDialog = true;
    },

    editItem(item) {
      this.editMode = true;
      this.itemsData = { ...item };
    },

    saveItem() {
      const conflictItem = this.itemsList.find(item => (
        item.item_name.toLowerCase() === this.itemsData.item_name.toLowerCase() &&
        item.item_quantity.toString().toLowerCase() === this.itemsData.item_quantity.toString().toLowerCase() &&
        item.category.toLowerCase() === this.itemsData.category.toLowerCase() &&
        item.unit_of_measure.toLowerCase() === this.itemsData.unit_of_measure.toLowerCase() &&
        item.school_level.toLowerCase() === this.itemsData.school_level.toLowerCase() &&
        item.room_number.toString().toLowerCase() === this.itemsData.room_number.toString().toLowerCase() &&
        item.acceptedby.toLowerCase() === this.itemsData.acceptedby.toLowerCase()
      ));
      if (conflictItem) {
        Swal.fire('Duplicate!', 'An item with the same details already exists. You should check it first', 'error');
        this.dialog = false;
        return
      }

      if (this.editMode) {
        api.post(`/items/update/${this.itemsData.id}`, this.itemsData)
          .then(response => {
            let i = this.itemsList.findIndex(item => item.id === this.itemsData.id);
            if (i !== -1) {
              this.itemsList.splice(i, 1, { ...this.itemsData });
              this.editMode = false;
              Swal.fire('Success!', 'Items updated successfully!', 'success');

            }
          })
          .catch(error => {
            console.error('Error updating item:', error);
            Swal.fire('Success!', 'Error updating!', 'error');

          });
      } else {
        api.post('/items/add', this.itemsData)
          .then(response => {
            this.itemsList.push({ ...this.itemsData });
            this.addDialog = false;
            this.getItems()
            Swal.fire('Success!', 'Items added successfully!', 'success');
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
                  text: 'Item deleted successfully.',
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
        unit_of_measure: item.unit_of_measure,
        adviser: '',
        acceptedby: null
      };
      this.setReturnDateMin();
      this.borrowDialog = true;
    },
    borrowItem() {
      if (this.borrowersData.quantity > this.borrowersData.item_quantity) {
        Swal.fire('Error!', 'Not enough stock available.', 'error');
        this.borrowDialog = false;
        return;
      }

      api.post('/borrowed-items', this.borrowersData)
        .then(response => {
          Swal.fire('Success!', 'Items borrowed successfully!', 'success');

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
        //const response = await api.get('http://26.11.249.89:8000/api/student');
        //const response = await api.get('http://localhost:8000/api/student');
        const response = await api.get('http://26.81.173.255:8000/api/student');
        console.log(response);
        this.studentsList = response.data.student.map(student => ({
      student_id: student.student_id,
      title: `${student.first_name} ${student.last_name}`, // Combine first and last name
      adviser: student.adviser ? student.adviser.full_name : ''
    }));
        console.log(this.studentsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      }

    },

    prepareReport(type) {
      this.reportType = type;
      this.filterDialog = true; // Open the filter dialog
    },

    async generateReport() {
      if (this.reportType === 'PDF') {
        await this.downloadPDF();
      } else if (this.reportType === 'EXCEL') {
        await this.downloadXLS();
      }
      this.filterDialog = false;
    },


    async convertExcel(data) {
      const excel = new ExcelJS.Workbook();
      const worksheet = excel.addWorksheet("Items");

      try {
        // Fetch image and convert to base64
        const imageResponse = await fetch('/src/assets/SNA Logo no BG.png');
        const imageBlob = await imageResponse.blob();
        const imageBase64 = await this.blobToBase64(imageBlob);

        const logo = excel.addImage({
          base64: imageBase64,
          extension: 'png'
        });

        worksheet.getCell('A6').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' } // White background color
        };

        for (let col = 1; col <= 9; col++) { // Columns A to I
          const cell = worksheet.getCell(6, col);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' } // White background color
          };
        }

        // Make sure other parts of the code remain unchanged
        worksheet.addImage(logo, {
          tl: { col: 1, row: 1 }, // Starting at B1 (col: 1, row: 0)
          ext: { width: 150, height: 150 },
          editAs: 'absolute'
        });

        worksheet.addImage(logo, {
          tl: { col: 7, row: 1 }, // Starting at H1 (col: 7, row: 0)
          ext: { width: 150, height: 150 },
          editAs: 'absolute'
        });

        worksheet.mergeCells('B1:C4');  // Left logo space
        worksheet.mergeCells('H1:I4');  // Right logo space
        worksheet.mergeCells('D1:G2');  // Title space
        worksheet.mergeCells('D3:G4');  // Subtitle space
        worksheet.mergeCells('D5:G6');  // Date space

        const titleCell = worksheet.getCell('D1');
        titleCell.value = "Saint Nicholas Academy";
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const subtitleCell = worksheet.getCell('D3');
        subtitleCell.value = "Items Report";
        subtitleCell.font = { size: 14, bold: true };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const dateCell = worksheet.getCell('D5');
        dateCell.value = `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`;
        dateCell.font = { size: 14, bold: true };
        dateCell.alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getRow(1).height = 40; // Adjust as needed
        worksheet.getRow(3).height = 40; // Adjust as needed
        worksheet.getRow(5).height = 40; // Adjust as needed
        worksheet.addRow();

        // Define starting row for items
        const startRow = 7;  // You can adjust this as needed

        // Add column headers for items
        const headers = [
          'Item Name',
          'Item Quantity',
          'Category',
          'Unit Of Measure',
          'Room Number',
          'School Level',
          'Custodian',
          'Borrowed Items',
          'Overdue Items',
          'Damaged Items'
        ];

        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4167B8' }
          };
          cell.font = { color: { argb: 'FFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Add data rows starting from the defined row
        data.forEach((item) => {
          const row = worksheet.addRow([
            item.item_name,
            item.item_quantity,
            item.category,
            item.unit_of_measure,
            item.room_number,
            item.school_level,
            item.acceptedby,
            this.totalBorrowedQuantities[item.id] || 0,
            item.overdue_items || 0,
            item.damaged_items || 0
          ]);

          row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center align the data cells
          });
        });

        // Adjust column widths based on the data
        worksheet.columns.forEach((column) => {
          const maxLength = column.values.reduce((acc, val) => {
            const length = val ? val.toString().length : 0;
            return Math.max(acc, length);
          }, 5);
          column.width = Math.min(maxLength + 2, 27); // Reduce padding and set a maximum width
        });

        return excel; // Return the excel workbook
      } catch (error) {
        console.error('Error in convertExcel:', error);
      }
    },


    async downloadXLS() {
      try {
        const data = this.applyFilters(this.itemsList);
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
        } else {
          console.error('Invalid ExcelJS.Workbook instance');
        }
      } catch (error) {
        console.error('Error downloading XLS:', error);
      }
    },

    async convertPDF(data) {
      const doc = new jsPDF();

      // Fetch image and convert to base64
      const imageResponse = await fetch('/src/assets/schoolLogo3.png');
      const imageBlob = await imageResponse.blob();
      const imageBase64 = await this.blobToBase64(imageBlob);

      // Add the image
      doc.addImage(imageBase64, 'PNG', 25, 10, 40, 40); 


      // Add the school name and other info
      doc.setFontSize(12);
      doc.text('Saint Nicholas Academy', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text('Address', 105, 30, null, null, 'center');
      doc.text('Contact No', 105, 35, null, null, 'center');
      doc.text(`As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 40, null, null, 'center');



      const headers = [
        ['Item Name', 'Item Quantity', 'Category', 'Unit Of Measure', 'Room Number', 'School Level', 'Custodian', 'Borrowed Items', 'Overdue Items', 'Damaged Items']
      ];

      const rows = data.map(item => [
        item.item_name,
        item.item_quantity,
        item.category,
        item.unit_of_measure,
        item.room_number,
        item.school_level,
        item.acceptedby,
        this.totalBorrowedQuantities[item.id] || 0,
        item.overdue_items || 0,
        item.damaged_items || 0
      ]);

      // Add the table to the PDF
      doc.autoTable({
        head: headers,
        body: rows,
        theme: 'striped',

        startY: 60, 
      });

      return doc;
    },




    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Split to get base64 part
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    async downloadPDF() {
      try {
        const data = this.applyFilters(this.itemsList);
        const pdf = await this.convertPDF(data);
        pdf.save('ItemsReport.pdf');

      } catch (error) {
        console.error('Error in downloadPDF:', error);
      }
    },


    applyFilters(data) {
      let filteredData = data;
      if (this.filter.category) {
        filteredData = filteredData.filter(item => item.category === this.filter.category);
      }
      if (this.filter.unitOfMeasure) {
        filteredData = filteredData.filter(item => item.unit_of_measure === this.filter.unitOfMeasure);
      }
      if (this.filter.roomNumber) {
        filteredData = filteredData.filter(item => item.room_number === this.filter.roomNumber);
      }
      if (this.filter.schoolLevel) {
        filteredData = filteredData.filter(item => item.school_level === this.filter.schoolLevel);
      }
      if (this.filter.acceptedBy) {
        filteredData = filteredData.filter(item => item.acceptedby === this.filter.acceptedBy);
      }
      return filteredData;
    },

    showFilterDialog() {
      this.filterDialog = true;

    }
  },
  computed: {
    filteredItems() {
      if (!this.search) return this.itemsList;
      return this.itemsList.filter(item => {
        const columnValue = item[this.searchColumn];
        if (typeof columnValue === 'string') {
          return columnValue.toLowerCase().includes(this.search.toLowerCase());
        } else {
          return columnValue.toString().includes(this.search);
        }
      });
    },

    roomNumbers() {
      return [...new Set(this.itemsList.map(item => item.room_number))];
    },

    acceptedBy() {
      return [...new Set(this.itemsList.map(item => item.acceptedby))];
    },

    isValid() {
      return !!this.borrowersData.student_id && !!this.borrowersData.return_date &&
        !!this.borrowersData.adviser;
    },

    addValidation(){
      return !!this.itemsData.item_name && !!this.itemsData.item_quantity && !!this.itemsData.category
       && !!this.itemsData.unit_of_measure && !!this.itemsData.room_number && !!this.itemsData.school_level
       && !!this.itemsData.acceptedby;
    }
  },

  watch: {
    itemsList() {
      this.$nextTick(() => {
        this.initializeTooltips();
      });
    }
  },

  watch: {
    'borrowersData.student_id': function (newStudentId) {
      // Find the selected student from the studentsList
      const selectedStudent = this.studentsList.find(student => student.student_id === newStudentId);

      // Update the adviser field based on the selected student
      if (selectedStudent) {
        this.borrowersData.adviser = selectedStudent.adviser;
      } else {
        this.borrowersData.adviser = '';
      }
    }
  },

};
</script>



<style lang="scss">
.v-table__wrapper {
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

  .v-icon {
    font-size: 28px;
  }
}

.tooltip-button {
  position: relative;
}
</style>