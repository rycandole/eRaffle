const sql = require("mssql/msnodesqlv8");

const config = {
  server: "DESKTOP-6L57IDU",
  database: "Raffle",
  options: {
    trustedConnection: true, // Set to true if using Windows Authentication
  },
  driver: "msnodesqlv8", // Required if using Windows Authentication
};

async function getUsers() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.query`SELECT * FROM dbo.tbl_Users Where isWinner = 0`;
    return result.recordset; // Only return the data
  } catch (err) {
    throw err;
  }
}

// Function to update a user's isWinner status
async function updateUserWinnerStatus(userId, isWinner) {
  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("isWinner", sql.Bit, isWinner)
      .query(
        `UPDATE dbo.tbl_Users SET isWinner = @isWinner WHERE UserId = @userId`
      );
  } catch (err) {
    throw err;
  }
}

module.exports = { getUsers, updateUserWinnerStatus };
