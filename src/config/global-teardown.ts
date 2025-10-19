import { Logger } from '../utils/logger';
import { DatabaseManager } from '../utils/database-manager';

/**
 * Global Teardown - Runs once after all tests
 * Used for cleanup, data removal, and resource disposal
 */
async function globalTeardown() {
  const logger = Logger.getInstance();
  logger.info('Starting global teardown...');

  try {
    // Clean up test data
    await cleanupTestData();
    
    // Close database connections
    await DatabaseManager.closeAllConnections();
    
    logger.info('Global teardown completed successfully');
  } catch (error) {
    logger.error('Global teardown failed:', error);
  }
}

async function cleanupTestData() {
  const logger = Logger.getInstance();
  
  try {
    logger.info('Cleaning up test data...');
    
    // Implement test data cleanup logic here
    // This could include removing test users, orders, etc.
    
    logger.info('Test data cleanup completed');
  } catch (error) {
    logger.error('Test data cleanup failed:', error);
    throw error;
  }
}

export default globalTeardown;