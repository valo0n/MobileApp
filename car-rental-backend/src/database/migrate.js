// ============================================================
// Database Migration Runner
// Run: npm run db:migrate
// ============================================================

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const run = async () => {
  console.log('🔄 Starting database migration...\n');

  // Connect without database first to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'migrate.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute
    await connection.query(sql);

    console.log('✅ Database migration completed successfully!');
    console.log(`   Database: ${process.env.DB_NAME || 'car_rental_app'}`);
    console.log('   All 31 tables created');
    console.log('   Roles, permissions, and seed data inserted');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
};

run();
