// working version
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const summaryPath = path.resolve('allure-report/widgets/summary.json');
const reportHtmlPath = path.resolve('allure-report/index.html');

function generateSummary() {
  if (!fs.existsSync(summaryPath)) {
    console.warn('Allure summary file not found!');
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      passRate: 0,
    };
  }

  const data = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  const total = data.statistic.total || 0;
  const passed = data.statistic.passed || 0;
  const failed = data.statistic.failed || 0;
  const skipped = data.statistic.skipped || 0;
  const passRate = total > 0 ? (passed * 100) / total : 0;

  return { total, passed, failed, skipped, passRate };
}

async function sendEmailWithReport() {
  const summary = generateSummary();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = process.env.EMAIL_SUBJECT || 'Playwright Automation Test Report';

  const body = `
Test Execution Summary:

Total Tests: ${summary.total}
Passed: ${summary.passed}
Failed: ${summary.failed}
Skipped: ${summary.skipped}

Pass Rate: ${summary.passRate.toFixed(2)}%

Please find the detailed report attached.

Thanks,  
Automation Team
  `.trim();

  const mailOptions = {
    from: `"Automation Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: subject,
    text: body,
    attachments: [
      {
        filename: 'index.html',
        path: reportHtmlPath,
        contentType: 'text/html',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully with summary and index.html');
}

sendEmailWithReport().catch((err) => {
  console.error('Failed to send email:', err);
});
