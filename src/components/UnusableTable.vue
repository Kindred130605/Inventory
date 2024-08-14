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
    const imageResponse = await fetch('/src/assets/schoolLogo3.png');
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await this.blobToBase64(imageBlob); // Use `this` to access the method

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
      'Category',
      'School Level',
      'Reported By',
      'Description',
      'Item Quantity',
      'Date Reported',
    ]);

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