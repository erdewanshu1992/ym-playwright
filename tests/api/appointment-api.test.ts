import { test } from '@playwright/test';
import { verifyOtp, getAppointments } from '../../src/api/helpers/api-helper';

test('🔁 OTP + Fetch Appointment', async ({ request }) => {
  const auth = await verifyOtp(request);
  const appointments = await getAppointments(request, auth);

  // 📊 Summary
  const total = appointments.length;
  const cancelled = appointments.filter(a => a.orderStatus === 'CANCELLED').length;
  const completed = appointments.filter(a => a.orderStatus === 'COMPLETED').length;
  const upcoming = appointments.filter(a =>
    ['ONGOING', 'BOOKED'].includes(a.orderStatus)
  ).length;

  const beauticians = [
    ...new Set(
      appointments.map(a => a.orderTrackResponse?.beauticianName).filter(Boolean)
    ),
  ];

  console.log(`\n✅ Total appointments for ${auth.userId}: ${total}`);
  console.log(`❌ CANCELLED: ${cancelled}`);
  console.log(`✅ COMPLETED: ${completed}`);
  console.log(`🕒 UPCOMING: ${upcoming}`);

  console.log(`\n👩‍🦰 Beauticians Assigned:`);
  beauticians.forEach(name => console.log(`- ${name}`));

  // 📋 Tabular summary
  console.log('\n📋 Appointment Table:');
  console.table(
    appointments.map(a => ({
      OrderID: a.orderId,
      BookingDate: a.bookingDate,
      PaymentMode: a.paymentMode,
      Amount: a.total,
      ServiceDuration: a.totalMinutes,
      Status: a.orderStatus,
      Beautician: a.orderTrackResponse?.beauticianName || 'N/A',
      Category: a.additionalFields?.mainCategoryName || 'N/A'
    }))
  );
});


// SKIP_GLOBAL_SETUP=true npx playwright test tests/api/appointment-api.test.ts
