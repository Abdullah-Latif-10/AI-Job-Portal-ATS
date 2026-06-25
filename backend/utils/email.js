const nodemailer = require("nodemailer");

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });
};

const FROM = '"Hireloop" <noreply@hireloop.app>';
const APP_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BRAND_NAME = process.env.EMAIL_BRAND_NAME || "HIRELOOP";
const BRAND_TAGLINE = process.env.EMAIL_BRAND_TAGLINE || "AI-POWERED HIRING PLATFORM";

const BRAND = {
  primary: "#6B5344",
  primaryDark: "#4F3D32",
  accent: "#C4A962",
  bg: "#FAFAF8",
  card: "#FFFFFF",
  border: "#EBE8E4",
  text: "#2A2520",
  muted: "#7A7268",
  soft: "#F5F2EE"
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildEmailLayout = ({
  preheader = "",
  eyebrow = "",
  title,
  greeting = "",
  bodyHtml = "",
  highlightHtml = "",
  ctaLabel = "",
  ctaUrl = "",
  footerNote = ""
}) => {
  const safePreheader = escapeHtml(preheader);
  const safeTitle = escapeHtml(title);
  const safeEyebrow = escapeHtml(eyebrow);
  const safeGreeting = greeting ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${BRAND.text};">${escapeHtml(greeting)}</p>` : "";
  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
          <tr>
            <td style="border-radius:12px;background:${BRAND.primary};">
              <a href="${escapeHtml(ctaUrl)}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:12px;">
                ${escapeHtml(ctaLabel)}
              </a>
            </td>
          </tr>
        </table>`
      : "";

  const highlightBlock = highlightHtml
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background:${BRAND.soft};border:1px solid ${BRAND.border};border-radius:14px;">
          <tr>
            <td style="padding:20px 22px;">
              ${highlightHtml}
            </td>
          </tr>
        </table>`
    : "";

  const footerExtra = footerNote
    ? `<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${BRAND.muted};">${escapeHtml(footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${safeTitle}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(42,37,32,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 100%);padding:34px 32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size:44px;line-height:1;color:${BRAND.accent};margin-bottom:14px;">&#9670;</div>
                    <div style="font-size:38px;font-weight:700;color:${BRAND.accent};letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(BRAND_NAME)}</div>
                    <div style="font-size:16px;color:rgba(255,255,255,0.82);margin-top:10px;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(BRAND_TAGLINE)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              ${safeEyebrow ? `<p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.accent};">${safeEyebrow}</p>` : ""}
              <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;font-weight:700;color:${BRAND.text};letter-spacing:-0.02em;">${safeTitle}</h1>
              ${safeGreeting}
              <div style="font-size:15px;line-height:1.65;color:${BRAND.text};">${bodyHtml}</div>
              ${highlightBlock}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BRAND.border};">
                <tr>
                  <td style="padding-top:22px;">
                    ${footerExtra}
                    <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:${BRAND.muted};">
                      Need help? Reply to this email or visit your Hireloop dashboard.
                    </p>
                    <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND.muted};">
                      &copy; ${new Date().getFullYear()} Hireloop &middot; A calm, AI-powered hiring platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;line-height:1.5;color:${BRAND.muted};max-width:600px;text-align:center;">
          You received this email because you have an account on Hireloop. If this wasn't you, you can safely ignore it.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const infoRow = (label, value) => `
  <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:${BRAND.text};">
    <span style="display:inline-block;min-width:72px;font-weight:600;color:${BRAND.muted};">${escapeHtml(label)}</span>
    ${escapeHtml(value)}
  </p>`;

const sendEmail = async (email, subject, html, mockBody) => {
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({ from: FROM, to: email, subject, html });
      console.log(`[SMTP] Email sent to: ${email} — ${subject}`);
      return true;
    } catch (error) {
      console.error("[SMTP] Error sending email via nodemailer:", error.message);
    }
  }

  console.log(`
┌────────────────────────────────────────────────────────┐
│                   [MOCK EMAIL SERVICE]                 │
├────────────────────────────────────────────────────────┤
${mockBody}
├────────────────────────────────────────────────────────┤
│  *Setup SMTP in .env to send real emails.              │
└────────────────────────────────────────────────────────┘
  `);
  return true;
};

const sendVerificationEmail = async (email, code) => {
  const html = buildEmailLayout({
    preheader: `Your Hireloop verification code is ${code}`,
    eyebrow: "Account verification",
    title: "Verification Code",
    greeting: "Hello,",
    bodyHtml: `
      <p style="margin:0 0 12px;">Use the code below to complete your registration.</p>
    `,
    highlightHtml: `
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};text-align:center;">Verification code</p>
      <div style="padding:22px;border:2px dashed ${BRAND.accent};border-radius:12px;background:#F0EBDD;">
        <p style="margin:0;font-size:48px;font-weight:700;letter-spacing:12px;color:#8A420F;text-align:center;font-family:monospace;">${escapeHtml(code)}</p>
      </div>
      <p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:${BRAND.muted};text-align:center;">This code expires in 10 minutes.</p>
    `,
    footerNote: "If you did not create a Hireloop account, no action is required."
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   Verify Your Hireloop Email Address         │
│  Code:      ${code.padEnd(42)} │
│  Expires:   In 15 minutes                              │`;

  return sendEmail(email, "Verify Your Hireloop Email Address", html, mockBody);
};

const sendApplicationReceivedEmail = async (email, candidateName, jobTitle, companyName, matchScore) => {
  const html = buildEmailLayout({
    preheader: `Application received for ${jobTitle}`,
    eyebrow: "Application confirmation",
    title: "Application Received",
    greeting: `Hi ${candidateName},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Your application for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(companyName)}</strong> has been successfully submitted.</p>
      <p style="margin:0;">We will notify you as soon as there is any update from the recruiter.</p>
    `,
    highlightHtml: `
      ${infoRow("Role", jobTitle)}
      ${infoRow("Company", companyName)}
      ${infoRow("Status", "Applied")}
      ${infoRow("Match Score", `${matchScore}%`)}
    `,
    ctaLabel: "Track my application",
    ctaUrl: `${APP_URL}/candidate/applications`
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   Application Received                         │
│  Candidate: ${candidateName.padEnd(42)} │
│  Job:       ${jobTitle.slice(0, 42).padEnd(42)} │
│  Company:   ${companyName.padEnd(42)} │
│  Match:     ${String(`${matchScore}%`).padEnd(42)} │`;

  return sendEmail(email, "Application Received", html, mockBody);
};

const sendJobMatchEmail = async (email, candidateName, jobTitle, companyName, matchScore, jobId) => {
  const html = buildEmailLayout({
    preheader: `New ${matchScore}% match: ${jobTitle} at ${companyName}`,
    eyebrow: "Job recommendation",
    title: "We found a strong match for you",
    greeting: `Hi ${candidateName},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Based on your profile and skills, we identified an opening that aligns well with your experience.</p>
    `,
    highlightHtml: `
      <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:${BRAND.text};">${escapeHtml(jobTitle)}</p>
      <p style="margin:0 0 14px;font-size:14px;color:${BRAND.muted};">${escapeHtml(companyName)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:6px 12px;border-radius:999px;background:${BRAND.card};border:1px solid ${BRAND.border};font-size:13px;font-weight:600;color:${BRAND.primary};">
            ${escapeHtml(String(matchScore))}% skill match
          </td>
        </tr>
      </table>
    `,
    ctaLabel: "View job & apply",
    ctaUrl: `${APP_URL}/candidate/jobs/${jobId}`,
    footerNote: `Reference: Job ID ${jobId}`
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   New Job Match — ${jobTitle.slice(0, 28).padEnd(28)} │
│  Candidate: ${candidateName.padEnd(42)} │
│  Company:   ${companyName.padEnd(42)} │
│  Match:     ${String(matchScore + "%").padEnd(42)} │
│  Job ID:    ${String(jobId).padEnd(42)} │`;

  return sendEmail(email, `New Job Match — ${jobTitle}`, html, mockBody);
};

const sendInterviewScheduledEmail = async (email, candidateName, jobTitle, companyName, date, time, mode, notes) => {
  const html = buildEmailLayout({
    preheader: `Interview scheduled for ${jobTitle} on ${date} at ${time}`,
    eyebrow: "Interview update",
    title: "Your interview has been scheduled",
    greeting: `Hi ${candidateName},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Great news — the hiring team at <strong>${escapeHtml(companyName)}</strong> has scheduled an interview for the <strong>${escapeHtml(jobTitle)}</strong> role.</p>
      <p style="margin:0;">Please review the details below and add this to your calendar.</p>
    `,
    highlightHtml: `
      ${infoRow("Date", date)}
      ${infoRow("Time", time)}
      ${infoRow("Format", mode)}
      ${notes ? infoRow("Notes", notes) : ""}
    `,
    ctaLabel: "View interview details",
    ctaUrl: `${APP_URL}/candidate/interviews`,
    footerNote: "Good luck — you've got this."
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   Interview Scheduled — ${jobTitle.slice(0, 22).padEnd(22)} │
│  Candidate: ${candidateName.padEnd(42)} │
│  Company:   ${companyName.padEnd(42)} │
│  Date:      ${String(date).padEnd(42)} │
│  Time:      ${String(time).padEnd(42)} │
│  Mode:      ${String(mode).padEnd(42)} │
│  Notes:     ${(notes || "None").slice(0, 42).padEnd(42)} │`;

  return sendEmail(email, `Interview Scheduled — ${jobTitle}`, html, mockBody);
};

const sendInterviewCancelledEmail = async (email, candidateName, jobTitle, companyName, date, time) => {
  const html = buildEmailLayout({
    preheader: `Interview cancelled for ${jobTitle}`,
    eyebrow: "Interview update",
    title: "Interview cancelled",
    greeting: `Hi ${candidateName},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">We're writing to let you know that your interview for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(companyName)}</strong> has been cancelled by the recruiter.</p>
      <p style="margin:0;">Your application remains active. We'll notify you if a new interview is scheduled or if there are further updates.</p>
    `,
    highlightHtml: `
      ${infoRow("Role", jobTitle)}
      ${infoRow("Company", companyName)}
      ${infoRow("Was scheduled", `${date} at ${time}`)}
    `,
    ctaLabel: "Check application status",
    ctaUrl: `${APP_URL}/candidate/applications`
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   Interview Cancelled                          │
│  Candidate: ${candidateName.padEnd(42)} │
│  Job:       ${jobTitle.slice(0, 42).padEnd(42)} │
│  Date:      ${String(date).padEnd(42)} │
│  Time:      ${String(time).padEnd(42)} │`;

  return sendEmail(email, `Interview Cancelled — ${jobTitle}`, html, mockBody);
};

const sendApplicationStatusUpdateEmail = async (email, candidateName, jobTitle, companyName, status) => {
  const statusMessages = {
    Applied: "Your application has been received and is in the queue for review.",
    Reviewed: "A recruiter has reviewed your application.",
    Shortlisted: "Congratulations — you've been shortlisted for the next stage.",
    Hired: "Congratulations — you've been selected for this role!",
    Rejected: "Thank you for your interest. The team has decided to move forward with other candidates."
  };

  const html = buildEmailLayout({
    preheader: `Application update: ${status} — ${jobTitle}`,
    eyebrow: "Application update",
    title: "Your application status has changed",
    greeting: `Hi ${candidateName},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">There's an update on your application for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(companyName)}</strong>.</p>
      <p style="margin:0;">${escapeHtml(statusMessages[status] || "Your application status has been updated.")}</p>
    `,
    highlightHtml: `
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};">Current status</p>
      <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.primaryDark};text-align:center;">${escapeHtml(status)}</p>
    `,
    ctaLabel: "View my applications",
    ctaUrl: `${APP_URL}/candidate/applications`
  });

  const mockBody = `│  Recipient: ${email.padEnd(42)} │
│  Subject:   Application Status Update                    │
│  Candidate: ${candidateName.padEnd(42)} │
│  Job:       ${jobTitle.slice(0, 42).padEnd(42)} │
│  Company:   ${companyName.padEnd(42)} │
│  Status:    ${String(status).padEnd(42)} │`;

  return sendEmail(email, `Application Update — ${status}`, html, mockBody);
};

module.exports = {
  sendVerificationEmail,
  sendJobMatchEmail,
  sendApplicationReceivedEmail,
  sendInterviewScheduledEmail,
  sendInterviewCancelledEmail,
  sendApplicationStatusUpdateEmail
};
