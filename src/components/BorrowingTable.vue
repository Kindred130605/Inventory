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

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" style="margin: 10px;" variant="flat" dark v-bind="props">
              GENERATE REPORT  <v-icon right>mdi-download</v-icon>
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
  
  
      <template v-slot:item= '{ item }'>
        <tr :key="item.item_id">
          <td>{{ item.item_name }}</td>
          <td>{{ item.category}}</td>
          <td>{{ item.unit_of_measure}}</td>
          <td>{{ item.room_number}}</td>
          <td>{{ item.school_level}}</td>
          <td>{{ item.student_id}}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.borrow_date}}</td>
          <td>{{ item.return_date}}</td>
          <td>{{ item.status}}</td>
          <td>{{ item.adviser}}</td>

          <td>
            <div class="icon-container">
            <v-btn @click="returnItem(item)" style="color:green; font-size:25px;"><v-icon>mdi-thumb-up </v-icon></v-btn>
            <v-btn @click="openDamageDialog(item)" style="color:red; font-size:25px;"><v-icon>mdi-account-hard-hat</v-icon></v-btn>
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
              label="Damaged By*" 
              >
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

      <!-- Add a dialog for filtering -->
  <v-dialog v-model="filterDialog" max-width="500">
    <v-card>
      <v-card-title>Filter Report</v-card-title>
      <v-card-text>
        <v-form ref="filterForm">
          <v-select v-model="filter.category" :items="category" label="Category"></v-select>
          <v-select v-model="filter.unitOfMeasure" :items="unitOfMeasure" label="Unit of Measure"></v-select>
          <v-select v-model="filter.roomNumber" :items="roomNumbers" label="Room Number"></v-select>
          <v-select v-model="filter.schoolLevel" :items="schoolLevel" label="School Level"></v-select>
          <v-select v-model="filter.acceptedBy" :items="acceptedBy" label="Adviser"></v-select>
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
import autoTable from 'jspdf-autotable';

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
      studentsList:[],

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

 mounted(){
  this.getBorrowers();
 },

 methods: {
  async getBorrowers() {
      try { 
        const response = await api.get('/borrowed-items');
        this.borrowinglist = response.data;
        this.$nextTick(() => {
          this.initializeTooltips();
        });
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },

    initializeTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    },

    openDamageDialog(item) {
      this.damagedItemData = {
        item_id: item.item_id,
        report_by: item.student_id, 
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

    // Style the header with a white background
    worksheet.getCell('A6').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' }
    };

    for (let col = 1; col <= 9; col++) { // Columns A to I
      const cell = worksheet.getCell(6, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' }
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

        // Title cell styling
        const titleCell = worksheet.getCell('D1');
        titleCell.value = "Saint Nicholas Academy";
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Subtitle cell styling
        const subtitleCell = worksheet.getCell('D3');
        subtitleCell.value = "Items Report";
        subtitleCell.font = { size: 14, bold: true };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Date cell styling
        const dateCell = worksheet.getCell('D5');
        dateCell.value = `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`;
        dateCell.font = { size: 14, bold: true };
        dateCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Adjust row heights
        worksheet.getRow(1).height = 40;
        worksheet.getRow(3).height = 40;
        worksheet.getRow(5).height = 40;

        // Add a row gap before the data table
        worksheet.addRow();

    // Add column headers
    const headers = [
      'Item Name',
      'Category',
      'Unit Of Measure',
      'Room Number',
      'School Level',
      'Borrower',
      'Quantity',
      'Borrow Date',
      'Return Date',
      'Status',
      'Adviser'
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' } // Blue header background
      };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // White font
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add data rows
    data.forEach(item => {
    const row = worksheet.addRow([
    item.item_name,
    item.category,
    item.unit_of_measure,
    item.room_number,
    item.school_level,
    item.student_id,
    item.quantity,
    item.borrow_date,
    item.return_date,
    item.status,
    item.adviser,
  ]);

  // Center align each cell in the row
  row.eachCell((cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
});
    // Adjust column widths based on content
    worksheet.columns.forEach((column) => {
      const maxLength = column.values.reduce((acc, val) => {
        const length = val ? val.toString().length : 0;
        return Math.max(acc, length);
      }, 5);
      column.width = Math.min(maxLength + 2, 25); // Reduce padding and set a maximum width
    });

    return excel; // Return the excel workbook
  } catch (error) {
    console.error('Error in convertExcel:', error);
  }
},

async downloadXLS() {
    try {
      const data = this.applyFilters(this.borrowinglist); // Or any other data you want to export
      const excel = await this.convertExcel(data); // Make sure convertExcel is awaited

      if (excel instanceof ExcelJS.Workbook) {
        const buffer = await excel.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Borrowing.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire({
          title: 'Download Success!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Cannot Download',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Invalid ExcelJS.Workbook instance');
      }
    } catch (error) {
      console.error('Error downloading XLS:', error);
    }
  },

  async downloadPDF() {
      const doc = new jsPDF();
      
      const imageResponse = await fetch('/src/assets/SNA Logo no BG.png');
      const imageBlob = await imageResponse.blob();
      const imageBase64 = await this.blobToBase64(imageBlob);

      // Add the image
      doc.addImage(imageBase64, 'PNG', 25, 10, 30, 30);  


      // Add the school name and other info
      doc.setFontSize(12);
      doc.text('Saint Nicholas Academy', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text('Address', 105, 30, null, null, 'center');
      doc.text('Contact No', 105, 35, null, null, 'center');
      doc.text(`As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 40, null, null, 'center');

      // Add table
      const filteredData = this.applyFilters(this.borrowinglist);

      const columns = [
        'Item Name', 'Category', 'Unit Of Measure', 'Room Number', 'School Level', 'Borrower', 'Quantity', 'Borrow Date', 'Return Date', 'Status', 'Adviser'
      ];

      const rows = filteredData.map(item => [
      item.item_name,
      item.category,
      item.unit_of_measure,
      item.room_number,
      item.school_level,
      item.student_name, 
      item.quantity,
      item.borrow_date,
      item.return_date,
      item.status,
      item.adviser
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 40,
        theme: 'striped',
        
        startY: 60,
      });

      // Save the PDF
      doc.save('BorrowingReport.pdf');

      Swal.fire({
          title: 'Download Success!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
    },



  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Split to get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
    filteredData = filteredData.filter(item => item.adviser === this.filter.acceptedBy);
  }
  return filteredData;
},

showFilterDialog() {
  this.filterDialog = true;
}
},

  computed: {
        filteredItems() {
          return this.borrowinglist.filter(item => {
            return item.item_name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.item_quantity.toString().includes(this.search);
          });
        },

        category() {
          return [...new Set(this.borrowinglist.map(item => item.category))];
        },

        unitOfMeasure() {
          return [...new Set(this.borrowinglist.map(item => item.unit_of_measure))];
        },

        roomNumbers() {
          return [...new Set(this.borrowinglist.map(item => item.room_number))];
        },

        schoolLevel() {
          return [...new Set(this.borrowinglist.map(item => item.school_level))];
        },

        acceptedBy() {
          return [...new Set(this.borrowinglist.map(item => item.adviser))];
        }

  },
  watch: {
  itemsList() {
    this.$nextTick(() => {
      this.initializeTooltips();
    });
  }
},
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