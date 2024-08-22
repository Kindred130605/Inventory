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

          <v-btn @click="returnItem(item)" style="color:green" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Return Item"><v-icon>mdi-clipboard-arrow-left</v-icon></v-btn>
          <v-btn @click="unusableItem(item)" style="color:red" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Unusable Item"><v-icon>mdi-alert-decagram</v-icon></v-btn>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>

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

    studentslist: [],

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
this.getDamagedItems();
    //this.getStudents();
    this.$nextTick(() => {
      this.initializeTooltips();
    });
},

methods: {
  async getDamagedItems() {
    try {
      const response = await api.get('/damaged-items');
      this.damagelist = response.data;
      this.$nextTick(() => {
          this.initializeTooltips();
        });
      console.log(this.damagelist);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  },

  initializeTooltips() {
      const tooltipTriggerlist = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerlist.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
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
    const result = await Swal.fire({
      title: 'Confirm',
      text: `Are you sure you want to mark ${item.item_name} as unusable?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as unusable',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
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
    }
  } catch (error) {
    console.error('Error marking item as unusable:', error);
    Swal.fire('Error', 'Failed to mark item as unusable', 'error');
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


    const headers = [
      'Item Name',
      'Category',
      'Unit Of Measure',
      'Room Number',
      'School Level',
      'Reported By',
      'Description',
      'Item Quantity',
      'Date Reported', 
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
      item.report_by,
      item.description,
      item.quantity,
      item.date_reported,
      item.adviser,
      ]);
         // Center align each cell in the row
         row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // Adjust column widths to fit content
    worksheet.columns.forEach((column) => {
      const maxLength = column.values.reduce((acc, val) => {
        const length = val ? val.toString().length : 0;
        return Math.max(acc, length);
      }, 10);
      column.width = maxLength + 2; // Adjust padding as needed
    });

    return excel; // Return the excel workbook
  } catch (error) {
    console.error('Error in convertExcel:', error);
  }
},

async downloadXLS() {
    try {
      const data = this.damagelist; // Or any other data you want to export
      //const data = this.applyFilters(this.damagelist); // Or any other data you want to export
      const excel = await this.convertExcel(data); // Make sure convertExcel is awaited

      if (excel instanceof ExcelJS.Workbook) {
        const buffer = await excel.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DamageReport.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire('Download Success!', 'Generate report successfully', 'success');

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
      const doc = await this.convertPDF(this.damagelist);
      doc.save('DamageReport.pdf');
      
      Swal.fire({
        title: 'Download Success!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },

    async downloadPDF() {
      const doc = new jsPDF();
      

      const imgData = await fetch('/src/assets/SNA Logo no BG.png')
        .then(res => res.blob())
        .then(this.blobToBase64);

      doc.addImage(imgData, 'PNG', 25, 10, 30, 30);

      doc.setFontSize(12);
      doc.text('Saint Nicholas Academy', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text('Address', 105, 30, null, null, 'center');
      doc.text('Contact No', 105, 35, null, null, 'center');
      doc.text(`As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 40, null, null, 'center'); 

      const filteredData = this.applyFilters(this.damagelist);

      const columns = [
        'Item Name', 'Category', 'Unit Of Measure', 'Room Number', 'School Level', 'Borrower', 'Quantity', 'Borrow Date', 'Return Date', 'Status', 'Adviser'
      ];

      const rows = filteredData.map(item => [
              item.item_name,
              item.category,
              item.unit_of_measure,
              item.room_number,
              item.school_level,
              item.report_by,
              item.description,
              item.quantity,
              item.date_reported,
              item.adviser,
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 40,
        theme: 'striped',
        
        startY: 60,
      });

      // Save the PDF
      doc.save('DamagedReport.pdf');


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
          return this.damagelist.filter(item => {
            return item.item_name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.item_quantity.toString().includes(this.search);
          });
        },

        category() {
          return [...new Set(this.damagelist.map(item => item.category))];
        },

        unitOfMeasure() {
          return [...new Set(this.damagelist.map(item => item.unit_of_measure))];
        },

        roomNumbers() {
          return [...new Set(this.damagelist.map(item => item.room_number))];
        },

        schoolLevel() {
          return [...new Set(this.damagelist.map(item => item.school_level))];
        },

        acceptedBy() {
          return [...new Set(this.damagelist.map(item => item.adviser))];
        }

  },

watch: {
  damagelist() {
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

</style>