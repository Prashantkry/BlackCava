import mysql from 'mysql2/promise';

// Create a connection pool
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Asdf@213',
    database: 'blackCava',
});

export default connection;
