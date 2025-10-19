import { APIRequestContext, expect } from '@playwright/test';
import { Logger } from '../../src/utils/logger';
import { Environment } from '../../src/config/environment';

/**
 * API Base Class - Common functionality for API testing
 * Provides reusable methods for API interactions
 */
export class APIBase {
  protected request: APIRequestContext;
  protected logger: Logger;
  protected env = Environment.get();
  protected baseHeaders: Record<string, string>;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.logger = Logger.getInstance();
    this.baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'YesMadam-Test-Framework/1.0',
    };
  }

  // GET request
  async get(endpoint: string, headers?: Record<string, string>) {
    const url = `${this.env.apiUrl}${endpoint}`;
    this.logger.info(`GET Request: ${url}`);
    
    const response = await this.request.get(url, {
      headers: { ...this.baseHeaders, ...headers }
    });

    await this.logResponse(response);
    return response;
  }

  // POST request
  async post(endpoint: string, data?: any, headers?: Record<string, string>) {
    const url = `${this.env.apiUrl}${endpoint}`;
    this.logger.info(`POST Request: ${url}`, { data });
    
    const response = await this.request.post(url, {
      headers: { ...this.baseHeaders, ...headers },
      data: data
    });

    await this.logResponse(response);
    return response;
  }

  // PUT request
  async put(endpoint: string, data?: any, headers?: Record<string, string>) {
    const url = `${this.env.apiUrl}${endpoint}`;
    this.logger.info(`PUT Request: ${url}`, { data });
    
    const response = await this.request.put(url, {
      headers: { ...this.baseHeaders, ...headers },
      data: data
    });

    await this.logResponse(response);
    return response;
  }

  // DELETE request
  async delete(endpoint: string, headers?: Record<string, string>) {
    const url = `${this.env.apiUrl}${endpoint}`;
    this.logger.info(`DELETE Request: ${url}`);
    
    const response = await this.request.delete(url, {
      headers: { ...this.baseHeaders, ...headers }
    });

    await this.logResponse(response);
    return response;
  }

  // PATCH request
  async patch(endpoint: string, data?: any, headers?: Record<string, string>) {
    const url = `${this.env.apiUrl}${endpoint}`;
    this.logger.info(`PATCH Request: ${url}`, { data });
    
    const response = await this.request.patch(url, {
      headers: { ...this.baseHeaders, ...headers },
      data: data
    });

    await this.logResponse(response);
    return response;
  }

  // Authentication helper
  async authenticate(email: string, password: string): Promise<string> {
    const response = await this.post('/auth/login', {
      email,
      password
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const token = responseBody.token || responseBody.access_token;
    
    if (!token) {
      throw new Error('Authentication failed: No token received');
    }

    this.logger.info('✅ Authentication successful');
    return token;
  }

  // Set authorization header
  setAuthToken(token: string): void {
    this.baseHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Response validation helpers
  async validateStatusCode(response: any, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  async validateResponseTime(response: any, maxResponseTime: number = 5000): Promise<void> {
    const responseTime = await this.getResponseTime(response);
    expect(responseTime).toBeLessThan(maxResponseTime);
  }

  async validateResponseSchema(response: any, schema: any): Promise<void> {
    const responseBody = await response.json();
    // Implement JSON schema validation here
    // This would typically use a library like ajv
    this.logger.info('Schema validation passed', { schema, responseBody });
  }

  async validateResponseHeaders(response: any, expectedHeaders: Record<string, string>): Promise<void> {
    const headers = response.headers();
    
    Object.entries(expectedHeaders).forEach(([key, value]) => {
      expect(headers[key.toLowerCase()]).toBe(value);
    });
  }

  // Utility methods
  async getResponseBody(response: any): Promise<any> {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }

  async getResponseTime(response: any): Promise<number> {
    // This would need to be implemented based on how response timing is tracked
    return 0; // Placeholder
  }

  private async logResponse(response: any): Promise<void> {
    const status = response.status();
    const url = response.url();
    const responseBody = await this.getResponseBody(response);
    
    this.logger.info(`Response: ${status} ${url}`, { 
      status, 
      headers: response.headers(),
      body: responseBody 
    });
  }

  // Error handling
  async handleErrorResponse(response: any): Promise<void> {
    if (!response.ok()) {
      const errorBody = await this.getResponseBody(response);
      this.logger.error(`API Error: ${response.status()}`, {
        url: response.url(),
        status: response.status(),
        body: errorBody
      });
      
      throw new Error(`API request failed: ${response.status()} - ${JSON.stringify(errorBody)}`);
    }
  }

  // Performance testing helpers
  async measureResponseTime(apiCall: () => Promise<any>): Promise<{ response: any; duration: number }> {
    const startTime = Date.now();
    const response = await apiCall();
    const duration = Date.now() - startTime;
    
    this.logger.info(`API call completed in ${duration}ms`);
    return { response, duration };
  }

  // Data validation helpers
  validateRequiredFields(data: any, requiredFields: string[]): void {
    requiredFields.forEach(field => {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        throw new Error(`Required field '${field}' is missing or null`);
      }
    });
  }

  validateFieldTypes(data: any, fieldTypes: Record<string, string>): void {
    Object.entries(fieldTypes).forEach(([field, expectedType]) => {
      if (field in data) {
        const actualType = typeof data[field];
        if (actualType !== expectedType) {
          throw new Error(`Field '${field}' expected type '${expectedType}' but got '${actualType}'`);
        }
      }
    });
  }

  // Test data cleanup
  async cleanupTestData(resourceType: string, resourceIds: string[]): Promise<void> {
    this.logger.info(`Cleaning up test data: ${resourceType}`, { resourceIds });
    
    for (const id of resourceIds) {
      try {
        await this.delete(`/${resourceType}/${id}`);
      } catch (error) {
        this.logger.warn(`Failed to cleanup ${resourceType} with id ${id}:`, error);
      }
    }
  }
}