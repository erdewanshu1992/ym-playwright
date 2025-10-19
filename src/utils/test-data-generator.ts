import { faker } from '@faker-js/faker';

/**
 * Test Data Generator - Creates realistic test data
 * Uses Faker.js for generating random but realistic data
 */
export class TestDataGenerator {
  
  static generateUserData() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      // phone: faker.phone.number('+91##########'), // @faker-js/faker have changed the signature for faker.phone.number().
      phone: '+91' + faker.string.numeric(10),
      password: 'Test@123456',
      address: {
        street: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai']),
        state: faker.helpers.arrayElement(['Delhi', 'Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu']),
        pincode: faker.location.zipCode('######'),
      },
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    };
  }

  static generateServiceBookingData() {
    return {
      serviceType: faker.helpers.arrayElement(['Salon', 'Spa', 'Massage', 'Grooming']),
      serviceCategory: faker.helpers.arrayElement(['Hair Care', 'Skin Care', 'Nail Care', 'Body Care']),
      bookingDate: faker.date.future(),
      timeSlot: faker.helpers.arrayElement(['10:00 AM', '2:00 PM', '6:00 PM']),
      specialInstructions: faker.lorem.sentence(),
      preferredGender: faker.helpers.arrayElement(['Male', 'Female', 'No Preference']),
    };
  }

  static generatePaymentData() {
    return {
      cardNumber: '4111111111111111', // Test card number
      expiryMonth: faker.date.future().getMonth() + 1,
      expiryYear: faker.date.future().getFullYear(),
      cvv: faker.finance.creditCardCVV(),
      cardholderName: faker.person.fullName(),
      billingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        pincode: faker.location.zipCode(),
      },
    };
  }

  static generateReviewData() {
    return {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      reviewTitle: faker.lorem.sentence(),
      wouldRecommend: faker.datatype.boolean(),
    };
  }

  static generateBusinessData() {
    return {
      businessName: faker.company.name(),
      businessType: faker.helpers.arrayElement(['Salon', 'Spa', 'Clinic']),
      ownerName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: '+91' + faker.string.numeric(10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      pincode: faker.location.zipCode(),
      gstNumber: faker.string.alphanumeric(15).toUpperCase(),
      panNumber: faker.string.alphanumeric(10).toUpperCase(),
    };
  }

  static generateRandomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  static generateRandomEmail(domain: string = 'testmail.com'): string {
    return `test_${this.generateRandomString(8)}@${domain}`;
  }

  static generateRandomPhoneNumber(): string {
    return '+91' + faker.string.numeric(10);
  }
}