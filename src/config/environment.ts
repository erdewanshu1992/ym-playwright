/**
 * Environment Configuration
 * Manages different environment settings and configurations
 */

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
  timeouts: {
    short: number;
    medium: number;
    long: number;
  };
  retries: number;
  headless: boolean;
}

export class Environment {
  private static config: EnvironmentConfig;

  static initialize(): void {
    const env = process.env.NODE_ENV || 'staging';
    
    switch (env.toLowerCase()) {
      case 'production':
        this.config = this.getProductionConfig();
        break;
      case 'staging':
        this.config = this.getStagingConfig();
        break;
      case 'development':
        this.config = this.getDevelopmentConfig();
        break;
      default:
        this.config = this.getStagingConfig();
    }
  }

  static get(): EnvironmentConfig {
    if (!this.config) {
      this.initialize();
    }
    return this.config;
  }

  private static getProductionConfig(): EnvironmentConfig {
    return {
      baseUrl: 'https://www.yesmadam.com/delhi-at-home-services',
      apiUrl: 'https://api.yesmadam.com',
      database: {
        host: process.env.PROD_DB_HOST || '',
        port: parseInt(process.env.PROD_DB_PORT || '3306'),
        name: process.env.PROD_DB_NAME || '',
        username: process.env.PROD_DB_USER || '',
        password: process.env.PROD_DB_PASSWORD || '',
      },
      timeouts: { short: 5000, medium: 15000, long: 30000 },
      retries: 3,
      headless: true,
    };
  }

  private static getStagingConfig(): EnvironmentConfig {
    return {
      baseUrl: 'https://www.yesmadam.com/delhi-at-home-services',
      apiUrl: 'https://api-staging.yesmadam.com',
      database: {
        host: process.env.STAGING_DB_HOST || '',
        port: parseInt(process.env.STAGING_DB_PORT || '3306'),
        name: process.env.STAGING_DB_NAME || '',
        username: process.env.STAGING_DB_USER || '',
        password: process.env.STAGING_DB_PASSWORD || '',
      },
      timeouts: { short: 5000, medium: 15000, long: 30000 },
      retries: 2,
      headless: true,
    };
  }

  private static getDevelopmentConfig(): EnvironmentConfig {
    return {
      baseUrl: 'https://www.yesmadam.com/delhi-at-home-services',
      apiUrl: 'https://api-dev.yesmadam.com',
      database: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT || '3306'),
        name: process.env.DEV_DB_NAME || 'yesmadam_dev',
        username: process.env.DEV_DB_USER || 'root',
        password: process.env.DEV_DB_PASSWORD || '',
      },
      timeouts: { short: 3000, medium: 10000, long: 20000 },
      retries: 1,
      headless: false,
    };
  }
}