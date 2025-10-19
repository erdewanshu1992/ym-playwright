import { test, expect } from '@playwright/test';
import { APIBase } from './api-base.test';
import { TestDataGenerator } from '../../src/utils/test-data-generator';

/**
 * Services API Tests
 * Tests all service-related API endpoints
 */
test.describe('Services API Tests', () => {
  let api: APIBase;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    api = new APIBase(request);
    
    // Authenticate once for all tests
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';
    authToken = await api.authenticate(email, password);
    api.setAuthToken(authToken);
  });

  test.describe('GET /services', () => {
    test('should fetch all services @api @smoke', async () => {
      const response = await api.get('/services');
      
      await api.validateStatusCode(response, 200);
      await api.validateResponseTime(response, 3000);
      
      const services = await response.json();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      
      // Validate service structure
      const firstService = services[0];
      api.validateRequiredFields(firstService, ['id', 'name', 'category', 'price', 'duration']);
      api.validateFieldTypes(firstService, {
        id: 'string',
        name: 'string',
        category: 'string',
        price: 'number',
        duration: 'number',
        active: 'boolean'
      });
    });

    test('should filter services by category @api @functional', async () => {
      const category = 'Salon';
      const response = await api.get(`/services?category=${category}`);
      
      await api.validateStatusCode(response, 200);
      
      const services = await response.json();
      services.forEach((service: any) => {
        expect(service.category).toBe(category);
      });
    });

    test('should filter services by location @api @functional', async () => {
      const location = 'Delhi';
      const response = await api.get(`/services?location=${location}`);
      
      await api.validateStatusCode(response, 200);
      
      const services = await response.json();
      expect(services.length).toBeGreaterThan(0);
    });

    test('should handle pagination @api @functional', async () => {
      const page = 1;
      const limit = 10;
      const response = await api.get(`/services?page=${page}&limit=${limit}`);
      
      await api.validateStatusCode(response, 200);
      
      const data = await response.json();
      expect(data.services).toBeDefined();
      expect(data.pagination).toBeDefined();
      expect(data.services.length).toBeLessThanOrEqual(limit);
    });
  });

  test.describe('GET /services/:id', () => {
    test('should fetch specific service by ID @api @smoke', async () => {
      // First get all services to get a valid ID
      const servicesResponse = await api.get('/services');
      const services = await servicesResponse.json();
      const serviceId = services[0].id;
      
      const response = await api.get(`/services/${serviceId}`);
      
      await api.validateStatusCode(response, 200);
      
      const service = await response.json();
      expect(service.id).toBe(serviceId);
      api.validateRequiredFields(service, ['id', 'name', 'category', 'price']);
    });

    test('should return 404 for non-existent service @api @negative', async () => {
      const nonExistentId = 'non-existent-id-12345';
      const response = await api.get(`/services/${nonExistentId}`);
      
      await api.validateStatusCode(response, 404);
    });
  });

  test.describe('POST /services', () => {
    let createdServiceIds: string[] = [];

    test.afterAll(async () => {
      // Cleanup created services
      await api.cleanupTestData('services', createdServiceIds);
    });

    test('should create new service @api @functional', async () => {
      const serviceData = {
        name: `Test Service ${TestDataGenerator.generateRandomString(5)}`,
        category: 'Salon',
        subcategory: 'Hair Care',
        price: 500,
        duration: 60,
        description: 'Test service description',
        active: true
      };

      const response = await api.post('/services', serviceData);
      
      await api.validateStatusCode(response, 201);
      
      const createdService = await response.json();
      expect(createdService.id).toBeDefined();
      expect(createdService.name).toBe(serviceData.name);
      
      createdServiceIds.push(createdService.id);
    });

    test('should validate required fields @api @validation', async () => {
      const incompleteData = {
        name: 'Incomplete Service'
        // Missing required fields
      };

      const response = await api.post('/services', incompleteData);
      
      await api.validateStatusCode(response, 400);
      
      const error = await response.json();
      expect(error.message).toContain('required');
    });

    test('should validate data types @api @validation', async () => {
      const invalidData = {
        name: 'Test Service',
        category: 'Salon',
        price: 'invalid-price', // Should be number
        duration: 60,
        active: true
      };

      const response = await api.post('/services', invalidData);
      
      await api.validateStatusCode(response, 400);
    });
  });

  test.describe('PUT /services/:id', () => {
    let testServiceId: string;

    test.beforeAll(async () => {
      // Create a test service for updating
      const testService = {
        name: 'Service for Update Test',
        category: 'Salon',
        price: 300,
        duration: 45,
        active: true
      };

      const response = await api.post('/services', testService);
      const createdService = await response.json();
      testServiceId = createdService.id;
    });

    test.afterAll(async () => {
      // Cleanup test service
      await api.cleanupTestData('services', [testServiceId]);
    });

    test('should update existing service @api @functional', async () => {
      const updateData = {
        name: 'Updated Service Name',
        price: 600,
        description: 'Updated description'
      };

      const response = await api.put(`/services/${testServiceId}`, updateData);
      
      await api.validateStatusCode(response, 200);
      
      const updatedService = await response.json();
      expect(updatedService.name).toBe(updateData.name);
      expect(updatedService.price).toBe(updateData.price);
    });

    test('should return 404 for non-existent service update @api @negative', async () => {
      const updateData = { name: 'Updated Name' };
      const response = await api.put('/services/non-existent-id', updateData);
      
      await api.validateStatusCode(response, 404);
    });
  });

  test.describe('DELETE /services/:id', () => {
    test('should delete existing service @api @functional', async () => {
      // Create a service to delete
      const testService = {
        name: 'Service to Delete',
        category: 'Salon',
        price: 200,
        duration: 30,
        active: true
      };

      const createResponse = await api.post('/services', testService);
      const createdService = await createResponse.json();
      const serviceId = createdService.id;

      // Delete the service
      const deleteResponse = await api.delete(`/services/${serviceId}`);
      
      await api.validateStatusCode(deleteResponse, 204);

      // Verify service is deleted
      const getResponse = await api.get(`/services/${serviceId}`);
      await api.validateStatusCode(getResponse, 404);
    });

    test('should return 404 for non-existent service deletion @api @negative', async () => {
      const response = await api.delete('/services/non-existent-id');
      
      await api.validateStatusCode(response, 404);
    });
  });

  test.describe('Performance Tests', () => {
    test('should handle concurrent requests @api @performance', async () => {
      const concurrentRequests = 10;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(api.get('/services'));
      }

      const results = await Promise.all(promises);
      
      results.forEach(response => {
        expect(response.status()).toBe(200);
      });
    });

    test('should respond within acceptable time limits @api @performance', async () => {
      const { response, duration } = await api.measureResponseTime(() => 
        api.get('/services')
      );
      
      expect(response.status()).toBe(200);
      expect(duration).toBeLessThan(2000); // Should respond within 2 seconds
    });
  });

  test.describe('Security Tests', () => {
    test('should require authentication for protected endpoints @api @security', async ({ request }) => {
      const unauthenticatedApi = new APIBase(request);

      const response = await unauthenticatedApi.post('/services', {
        name: 'Unauthorized Service',
        category: 'Test'
      });

      await api.validateStatusCode(response, 401);
    });

    test('should validate user permissions @api @security', async () => {
      // Test with different user roles if applicable
      const limitedUserResponse = await api.get('/services/admin-only-endpoint');
      
      // Should return 403 if user doesn't have admin permissions
      expect([200, 403]).toContain(limitedUserResponse.status());
    });
  });
});