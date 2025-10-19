// Step 1: Import modules
import { test, expect, devices } from "@playwright/test";
import chalk from "chalk";

test.use({
  ...devices["iPhone 13"], // Emulator view
});

test("✅ OTP API mocking + Emulator view (YesMadam login)", async ({
  page,
}) => {
  // Step 2: Intercept OTP API
  await page.route("**/v3/userapi/otp/verification", async (route) => {
    const request = route.request();
    const postData = await request.postDataJSON();
    console.log("🛰️ Intercepted OTP payload:", postData);

    // ✅ Mock match condition
    if (postData.mobile === "9855566677" && postData.otp === "2222") {
      console.log("✅ Mock matched, returning mocked success");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            token: "mocked-otp-token-123",
            user: {
              id: 9999,
              name: "QA Dev",
            },
          },
          message: "OTP Verified Successfully",
          status: true,
        }),
      });
    } else {
      console.log("❌ Mock failed, returning Invalid OTP");
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Invalid OTP",
          status: false,
        }),
      });
    }
  });

  // Step 3: Go to site
  await page.goto("https://www.yesmadam.com");

  // Step 4: Open login UI
  await page.locator("#login_drawer").click();
  await page.waitForTimeout(2000);

  // Step 5: Fill mobile
  await page.getByPlaceholder("Mobile Number*").fill("0000000000");

  // Step 6: Click Continue
  console.log(await page.locator('button:has-text("Continue")').count());

  const continueBtn = page.locator('button:has-text("Continue")');

  const box = await page.locator('button:has-text("Continue")').boundingBox();
  console.log("Bounding box:", box);

  await page.screenshot({ path: "before-click.png", fullPage: true });

  await page
    .locator('button:has-text("Continue")')
    .evaluate((node) => (node as HTMLElement).click());
  // await page.pause();

  try {
    // Step 1: Wait for toast
    const toast = page.getByText("Please enter valid Mobile Number", {
      exact: true,
    });
    await toast.waitFor({ state: "visible", timeout: 5000 });
    await expect(toast).toHaveText("Please enter valid Mobile Number");

    // Step 3 (optional): Get toast text
    const toastText = await toast.innerText();
    console.log(chalk.yellowBright("📢 Toast message is:", toastText));
  } catch (error) {
    console.error(chalk.redBright("❌ Error waiting for toast:", error));
  }

  // Step 7: Enter mocked OTP
  const otpInput = await page.waitForSelector(
    '//input[@autocomplete="one-time-code"]',
    {
      timeout: 10000,
    }
  );
  await otpInput.fill("2222");

  // Step 8: Let response reflect
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "after-otp.png", fullPage: true });

  // ✅ Final assertion — this is the element shown after login
  await expect(page.locator('h4:has-text("Test")')).toBeVisible();

  // Optional URL check
  // await expect(page).toHaveURL(/.*home.*/);
});

// Step 9: Make file a module
export {};

























// // Step 1: Import modules
// import { test, expect, devices } from "@playwright/test";

// test.use({
//   ...devices["iPhone 13"],
// });

// // Step 3: Start test block
// test("✅ OTP API mocking + Emulator view (YesMadam login)", async ({
//   page,
// }) => {
//   // Step 4: Intercept OTP API 9855566677
//   await page.route("**/v3/userapi/otp/verification", async (route) => {
//     const request = route.request();
//     const postData = await request.postDataJSON();
//     console.log('🔍 Incoming OTP request payload:', postData);

//     if (
//       postData.mobile === "0000000000" &&
//       postData.platform === "WEB MOBILE" &&
//       postData.messagehash === "yesmadam.com" &&
//       postData.otp === "2222"
//     ) {
//       await route.fulfill({
//         status: 200,
//         contentType: "application/json",
//         body: JSON.stringify({
//           data: {
//             token: "mocked-otp-token-123",
//             user: {
//               id: 9999,
//               name: "QA Dev",
//             },
//           },
//           message: "OTP Verified Successfully",
//           status: true,
//         }),
//       });
//     } else {
//       await route.fulfill({
//         status: 401,
//         body: JSON.stringify({
//           message: "Invalid OTP",
//           status: false,
//         }),
//       });
//     }
//   });

//   // Step 5: Navigate to login
//   await page.goto("https://www.yesmadam.com");

//   // Step 6: Open login
//   await page.locator("#login_drawer").click();
//   await page.waitForTimeout(3000);

//   // Step 7: Fill mobile number
//   await page.getByPlaceholder("Mobile Number*").fill("9855566677");
//   // await page.pause(); // Put this right before click

//   // Step 8: Click continue to trigger OTP
//   console.log(await page.locator('button:has-text("Continue")').count());

//   const continueBtn = page.locator('button:has-text("Continue")');

//   const box = await page.locator('button:has-text("Continue")').boundingBox();
//   console.log("Bounding box:", box);

//   await page.screenshot({ path: "before-click.png", fullPage: true });

//   await page.locator('button:has-text("Continue")').evaluate((node) => (node as HTMLElement).click());
//   // await page.pause();

//   // Step 9: Fill mocked OTP
//   const visibleOtpInput = await page.waitForSelector('//input[@autocomplete="one-time-code"]',{ timeout: 10000 }
//   );
//   await visibleOtpInput.fill("2222");

//   // Step 10: Assertion
//   await expect(page.locator('h4:has-text("Test")')).toBeVisible();
//   await expect(page).toHaveURL(/.*home.*/); // Optional URL check

// });

// // Step 11: Make file a module
// export {};

// // SKIP_GLOBAL_SETUP=true npx playwright test tests/api/otp-mock.test.ts
