import * as XLSX from 'xlsx';

export const generateExcel = (data: any[], sheetName: string): void => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate and download file
  XLSX.writeFile(wb, `${sheetName.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
}; 