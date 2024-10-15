import mysql from 'mysql2/promise';

// Create a connection pool
const connection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Asdf@213',
    database: 'blackCava',
});

export default connection;
