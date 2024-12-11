USE Raffle

CREATE TABLE tbl_Users (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing ID
    Name NVARCHAR(255) NOT NULL,      -- Name as a string
    IsWinner BIT NOT NULL DEFAULT 0   -- IsWinner as a boolean with default value false
);
GO