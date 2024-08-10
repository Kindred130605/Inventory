import ExcelJS from 'exceljs';

// Function to convert data into an Excel workbook
function convertExcel(data) {
  const excel = new ExcelJS.Workbook();
  const worksheet = excel.addWorksheet("Items");

  // Define header information
  const header1 = "Saint Nicholas Academy";
  const header2 = "Address";
  const header3 = "Contact No";

  // Add the logo to the workbook
  const logo = excel.addImage({
    filename: 'src/assets/schoolLogo3.png', // Adjust path as needed
    extension: 'png'
  });

  // Add the logo to the worksheet
  worksheet.addImage(logo, {
    tl: { col: 0, row: 0 }, // Top-left corner of the logo
    ext: { width: 180, height: 120 }, // Size of the logo
    editAs: 'absolute' // Keeps the image at its absolute position
  });

  // Add header rows
  worksheet.mergeCells('A1:J1'); // Merge cells for header row
  worksheet.getCell('A1').value = header1; // Set header text
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A1').font = { size: 16, bold: true };

  worksheet.mergeCells('A2:J2'); // Merge cells for second header row
  worksheet.getCell('A2').value = header2;
  worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A2').font = { size: 14 };

  worksheet.mergeCells('A3:J3'); // Merge cells for third header row
  worksheet.getCell('A3').value = header3;
  worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A3').font = { size: 12 };

  // Add column headers for items
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
  ]).font = { bold: true };

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

  return excel;
}

export default convertExcel;
