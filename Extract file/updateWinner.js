const xlsx = require('xlsx');
const fs = require('fs');

// Path to the Excel file
const filePath = './Winner all.xlsx'; // Update this path to your file

// Read the Excel file
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const data = xlsx.utils.sheet_to_json(sheet);

// Initialize an array for SQL updates
const sqlUpdates = [];

// Process each row in the Excel data
data.forEach(row => {
  const email = row['Email Address']; // Adjust header name if different
  const isWinner = row['IsWinner']; // Adjust header name if present in the Excel

  if (email) {
    // Generate SQL update statement
    sqlUpdates.push(
      `UPDATE tbl_Users SET IsWinner = ${isWinner || 0} WHERE Email = '${email}';`
    );
  }
});

// Combine all update statements
const sqlStatement = sqlUpdates.join('\n');

// Save to a file or log it
const outputPath = './sql/eRaffleWinnerUpdate.sql';
fs.writeFileSync(outputPath, sqlStatement, 'utf8');
console.log(`SQL statement written to ${outputPath}`);
