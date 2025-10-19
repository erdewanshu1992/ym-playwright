import { test, expect, request } from '@playwright/test';

interface OtpVerificationResponse {
  status_code?: number;
  status?: string;
  message?: string; // token here
  object?: {
    user_id?: number;
    [key: string]: any;
  };
}

test('Verify OTP and fetch appointments', async ({ request }) => {
  // Step 1: OTP verification
  const otpRes = await request.post('https://api-live.yesmadam.com/v3/userapi/otp/verification', {
    data: {
      mobile: '9855566677',
      otp: '2222',
    },
  });

  const otpData: OtpVerificationResponse = await otpRes.json();

  const token = otpData.message; // Token is in `message`
  const userId = otpData.object?.user_id?.toString();

  console.log("OTP Token:", token);
  console.log("User ID:", userId);

  expect(token).toBeTruthy();
  expect(userId).toBeTruthy();

  // Step 2: Fetch appointments
  const appointmentRes = await request.post('https://api-live.yesmadam.com/v3/userapi/myappointments', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      userId,
      page: '0',
      status: '2',
    },
  });

  const appointmentData = await appointmentRes.json();
  console.log("Appointments:", JSON.stringify(appointmentData, null, 2));

  expect(appointmentData).toHaveProperty('object');
  expect(Array.isArray(appointmentData.object)).toBe(true);
  console.log(`Total appointments: ${appointmentData.object.length}`);

});





// This code is a standalone script that performs OTP verification and fetches appointments from the Yes Madam API.
// It does not include any Playwright or Allure testing framework code.
// To run this, you can use Node.js with the fetch API available in modern versions or
// by using a polyfill like node-fetch for older versions.


// SKIP_GLOBAL_SETUP=true npx playwright test tests/api/appointment-api.test.ts










































/*
// Step 2: Fetch appointments
  const body = {
    userId,
    status: '2'
  };

  console.log('Sending Request Body:', body);

  const appointmentRes = await request.post('https://api-live.yesmadam.com/v3/userapi/myappointments',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: body,
    }
  );
*/