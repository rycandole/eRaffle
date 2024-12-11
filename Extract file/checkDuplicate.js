const xlsx = require('xlsx');

// Function to check for duplicate emails
function checkDuplicateEmails(filePath, emailColumn = 'Email Address') {
  // Read the Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const data = xlsx.utils.sheet_to_json(sheet);

  // Collect and count email occurrences
  const emailCounts = {};
  data.forEach(row => {
    const email = row[emailColumn]; // Get the email column
    if (email) {
      emailCounts[email] = (emailCounts[email] || 0) + 1;
    }
  });

  // Find duplicates
  const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);

  // Output results
  if (duplicates.length > 0) {
    console.log('Duplicate emails found:');
    duplicates.forEach(([email, count]) => {
      console.log(`${email}: ${count} occurrences`);
    });
  } else {
    console.log('No duplicate emails found.');
  }

  return duplicates;
}

// Example usage
const filePath = './eRafffleWinner.xlsx'; // Update this path to your file
checkDuplicateEmails(filePath);
