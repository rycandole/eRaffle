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
    const result = await pool.query`SELECT * FROM dbo.tbl_Users Where IsWinner = 0`;
    return result.recordset; // Only return the data
  } catch (err) {
    throw err;
  }
}

// Function to update a user's isWinner status
async function updateUserWinnerStatus(Id, IsWinner) {
  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("Id", sql.Int, Id)
      .input("IsWinner", sql.Bit, IsWinner)
      .query(
        `UPDATE dbo.tbl_Users SET IsWinner = @IsWinner WHERE Id = @Id`
      );
  } catch (err) {
    throw err;
  }
}

module.exports = { getUsers, updateUserWinnerStatus };
