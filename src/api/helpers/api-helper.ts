import { APIRequestContext, expect } from '@playwright/test';

export interface AuthResult {
  token: string;
  userId: string;
}

export async function verifyOtp(request: APIRequestContext): Promise<AuthResult> {
  const res = await request.post('https://api-live.yesmadam.com/v3/userapi/otp/verification', {
    data: {
      mobile: '9855566677',
      otp: '2222',
    },
  });

  const data = await res.json();

  const token = data.message;
  const userId = data.object?.user_id?.toString();

  expect(token, 'Token not found').toBeTruthy();
  expect(userId, 'User ID not found').toBeTruthy();

  return { token, userId };
}

export async function getAppointments(request: APIRequestContext, auth: AuthResult): Promise<any[]> {
  const res = await request.post('https://api-live.yesmadam.com/v3/userapi/myappointments', {
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'Content-Type': 'application/json',
    },
    data: {
      userId: auth.userId,
      page: '0',
      status: '2',
    },
  });

  const data = await res.json();

  expect(data).toHaveProperty('object');
  expect(Array.isArray(data.object)).toBe(true);

  return data.object;
}
