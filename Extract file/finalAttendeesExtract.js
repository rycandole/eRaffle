const xlsx = require('xlsx');
const fs = require('fs');

// Path to the Excel file
const filePath = './finalAttendees.xlsx'; // Update this path to your file

// Read the Excel file
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const data = xlsx.utils.sheet_to_json(sheet);

// Initialize an array for formatted values
const formattedRows = [];

// Process each row in the Excel data
data.forEach(row => {
  const email = row['Email Address']; // Adjust header name if different
  const fullName = row['Full Name']; // Adjust header name if different
  if (email && fullName) {
    formattedRows.push(`('${email}', '${fullName}', 0, 0)`);
  }
});

// Combine the formatted rows into a SQL-like statement
const sqlValues = formattedRows.join(',\n');
const sqlStatement = `INSERT INTO tbl_Users (Email, Username, IsWinner, IsOnTime) \nVALUES\n${sqlValues};`;

// Save to a file or log it
const outputPath = './sql/finalAttendees.sql';
fs.writeFileSync(outputPath, sqlStatement, 'utf8');
console.log(`SQL statement written to ${outputPath}`);
