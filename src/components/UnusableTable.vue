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
 
      <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" style="margin: 10px;" variant="flat" dark v-bind="props">
              GENERATE REPORT <v-icon right>mdi-download</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="downloadPDF()">
              <v-icon left>mdi-download</v-icon>
              PDF
            </v-list-item>
            <v-list-item @click="downloadXLS()">
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
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export default {
 
  data() {
    return {
      search: '',
      unusablelist: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Category', key: 'category' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Damaged By', key: 'report_by' },
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
this.$nextTick(() => {
      this.initializeTooltips();
    });
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

  initializeTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
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
          tl: { col: 1, row: 0 }, // Starting at B1 (col: 1, row: 0)
          ext: { width: 180, height: 120 },
          editAs: 'absolute'
        });

        worksheet.addImage(logo, {
          tl: { col: 7, row: 0 }, // Starting at H1 (col: 7, row: 0)
          ext: { width: 180, height: 120 },
          editAs: 'absolute'
        });

        worksheet.mergeCells('B1:C4');  // Left logo space
        worksheet.mergeCells('H1:I4');  // Right logo space
        worksheet.mergeCells('D1:G2');  // Title space
        worksheet.mergeCells('D3:G4');  // Subtitle space
        worksheet.mergeCells('D5:G6');  // Date space

        const titleCell = worksheet.getCell('D1');
        titleCell.value = "School Name";
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const subtitleCell = worksheet.getCell('D3');
        subtitleCell.value = "Items Report";
        subtitleCell.font = { size: 12, bold: true };
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const dateCell = worksheet.getCell('D5');
        dateCell.value = `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`;
        dateCell.font = { size: 12, bold: true };
        dateCell.alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getRow(1).height = 40; // Adjust as needed
        worksheet.getRow(3).height = 40; // Adjust as needed
        worksheet.getRow(5).height = 40; // Adjust as needed
        worksheet.addRow();

        const startRow = 7; 

    const headers = [
      'Item Name',
      'Category',
      'School Level',
      'Damaged By',
      'Description',
      'Item Quantity',
      'Date Reported',
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

    // Add data rows
    data.forEach(item => {
      worksheet.addRow([
      item.item_name,
      item.category,
      item.school_level,
      item.report_by,
      item.description,
      item.quantity,
      item.date_reported,
      ]);
    });

    worksheet.columns.forEach((column) => {
          const maxLength = column.values.reduce((acc, val) => {
            const length = val ? val.toString().length : 0;
            return Math.max(acc, length);
          }, 5);
          column.width = Math.min(maxLength + 2, 15); // Reduce padding and set a maximum width
        });


    return excel; // Return the excel workbook
  } catch (error) {
    console.error('Error in convertExcel:', error);
  }
},

async convertPDF(data) {
      const doc = new jsPDF();

      // Fetch image and convert to base64
      const imgData = await fetch('/src/assets/schoolLogo3.png')
        .then(res => res.blob())
        .then(this.blobToBase64);

      doc.addImage(imgData, 'PNG', 25, 10, 40, 40);


      // Add the school name and other info
      doc.setFontSize(12);
      doc.text('Saint Nicholas Academy', 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text('Address', 105, 30, null, null, 'center');
      doc.text('Contact No', 105, 35, null, null, 'center');
      doc.text(`As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 40, null, null, 'center');

      doc.autoTable({
    head: [['Item Name', 'Category', 'School Level', 'Damaged By', 'Description', 'Item Quantity', 'Date Reported']],
    body: data.map(item => [
      item.item_name,
      item.category,
      item.school_level,
      item.report_by,
      item.description,
      item.quantity,
      item.date_reported
    ]),
    startY: 50, 
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

  async downloadXLS() {
    try {
      const data = this.unusablelist; // Or any other data you want to export
      const excel = await this.convertExcel(data); // Make sure convertExcel is awaited

      if (excel instanceof ExcelJS.Workbook) {
        const buffer = await excel.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Unusable.xlsx';
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
    try {
      const data = this.unusablelist;
      const pdf = await this.convertPDF(data);
      pdf.save('UnusableReport.pdf');

      Swal.fire({
          title: 'Download Success!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
    } catch (error) {
      console.error('Error in downloadPDF:', error);
    }
  },


},

watch: {
  itemsList() {
    this.$nextTick(() => {
      this.initializeTooltips();
    });
  }
}


}

</script>

<style lang="scss">

</style>