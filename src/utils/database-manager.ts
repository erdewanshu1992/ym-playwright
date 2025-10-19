import mysql from 'mysql2/promise';
import { MongoClient, Db } from 'mongodb';
import { Environment } from '../config/environment';
import { Logger } from './logger';

/**
 * Database Manager - Handles database connections and operations
 * Supports MySQL and MongoDB for comprehensive data validation
 */
export class DatabaseManager {
  private static mysqlConnection: mysql.Connection | null = null;
  private static mongoClient: MongoClient | null = null;
  private static mongoDB: Db | null = null;

  static async getMySQLConnection(): Promise<mysql.Connection> {
    if (!this.mysqlConnection) {
      const env = Environment.get();
      const logger = Logger.getInstance();

      try {
        this.mysqlConnection = await mysql.createConnection({
          host: env.database.host,
          port: env.database.port,
          user: env.database.username,
          password: env.database.password,
          database: env.database.name,
        });

        logger.info('MySQL connection established');
      } catch (error) {
        logger.error('Failed to connect to MySQL:', error);
        throw error;
      }
    }

    return this.mysqlConnection;
  }

  static async getMongoConnection(): Promise<Db> {
    if (!this.mongoDB) {
      const env = Environment.get();
      const logger = Logger.getInstance();

      try {
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
        this.mongoClient = new MongoClient(mongoUrl);
        await this.mongoClient.connect();
        this.mongoDB = this.mongoClient.db(env.database.name);

        logger.info('MongoDB connection established');
      } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        throw error;
      }
    }

    return this.mongoDB;
  }

  static async executeQuery(query: string, params?: any[]): Promise<any> {
    const connection = await this.getMySQLConnection();
    const logger = Logger.getInstance();

    try {
      logger.debug(`Executing query: ${query}`, { params });
      const [results] = await connection.execute(query, params);
      return results;
    } catch (error) {
      logger.error('Query execution failed:', { query, params, error });
      throw error;
    }
  }

  static async findInMongo(collection: string, filter: any): Promise<any[]> {
    const db = await this.getMongoConnection();
    const logger = Logger.getInstance();

    try {
      logger.debug(`MongoDB find operation`, { collection, filter });
      const results = await db.collection(collection).find(filter).toArray();
      return results;
    } catch (error) {
      logger.error('MongoDB find operation failed:', { collection, filter, error });
      throw error;
    }
  }

  static async closeAllConnections(): Promise<void> {
    const logger = Logger.getInstance();

    try {
      if (this.mysqlConnection) {
        await this.mysqlConnection.end();
        this.mysqlConnection = null;
        logger.info('MySQL connection closed');
      }

      if (this.mongoClient) {
        await this.mongoClient.close();
        this.mongoClient = null;
        this.mongoDB = null;
        logger.info('MongoDB connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }
  }
}