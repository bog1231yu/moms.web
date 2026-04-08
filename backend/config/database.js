// Database configuration file
// Using file-based storage for demo purposes (no MongoDB required)

const connectDB = async () => {
  try {
    console.log('Using file-based storage (no database required)');
    console.log('Data will be stored in backend/data/ directory');
    return true;
  } catch (error) {
    console.error(`Error initializing storage: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
