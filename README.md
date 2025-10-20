# AI-Powered Job Application Processing Workflow

## 1. The Problem

Hiring teams receive dozens or hundreds of applications daily. For most companies, these applications come from multiple platforms such as LinkedIn, Mynimo, Jobstreet, etc. While these hiring platforms have tools that can organize job applications to some extent, there are cases when applicants send an email directly to the recruiter's mailbox to have a better chance of being noticed. For email applications, it is kind of inevitable that the recruiter will have to manually read each applicant's email. In this scenario, sorting, analyzing resumes, checking position availability, and notifying applicants manually is time-consuming, prone to errors, and slows down recruitment. Valuable candidates might be lost due to delayed responses, and HR teams waste time on repetitive tasks.

---

## 2. Proposed Solution

The proposed automation solution is to implement an AI-based processing of email job applications using n8n, Google Gemini (AI), Google Drive, Google Sheets, Slack, and Gmail. Key tasks include:

- Analyzing resumes and cover letters automatically (oPDFs and Word documents supported).
- Extracting applicant details, experience, education, and skills using AI.
- Uploading resumes to Google Drive for easy access and retrieval.
- Checking if the position being applied for is still available, and immediately send a response if there is no vacancy.
- Sending a summary of the application to a dedicated channel in Slack.
- Automatically updating the job application tracking sheet.
- Handling Shortlist/Decline decisions asynchronously via Google Apps Script to prevent the workflow from being blocked.

**Benefits:**

- Speeds up applicant processing.
- Reduces human error in extracting key information with rule-based AI prompts.
- Keeps HR team informed of new email applications in real-time via Slack.
- Improves candidate experience with timely notifications.

**Key Performance Indicators (KPIs) to Track:**
- **Average time from application receipt to initial HR review:** Target reduction of 80% versus manual process.  
- **Applications processed per day:** Increased throughput due to automation.  
- **Accuracy of extracted candidate information:** Spot-checked for >95% accuracy.  
- **Time-to-decision for shortlist/decline actions:** Reduced thanks to asynchronous Slack handling.  
- **HR team satisfaction and adoption rate:** Evaluated via survey after one month.  

**Implementation Challenges & Workarounds**
1. Applicant resumes do not have a universal format, so I had to implement AI parsing in order to consistently get applicant information that makes sense.
2. When there is a human involved in the loop, waiting for the human decision will take up resources in the cloud. In order to circumvent this, I implemented a separate endpoint for handling the human decisions (Shortlist/Deny) via Google App Script.

---

## 3. Workflow Overview

1. **Gmail Trigger** – Monitors the HR mailbox for unread job applications with attachments (PDF, DOCX, DOC).
2. **File Parsing** – Depending on file type:
   - PDF → Parse text.
   - DOC/DOCX → Read Doc content.
3. **Edit Fields** – Consolidates parsed text into a single field for AI analysis.
4. **Analyze Resume with Gemini (AI)** – Extracts structured data (name, email, phone, skills, education, experience, cover letter summary).
5. **Map AI analysis to JSON** – Converts AI output into clean JSON.
6. **Upload Resume to Google Drive** – Stores resumes in a dedicated folder.
7. **Check Applied Position Availability** – Looks up the requested position in a Google Sheet.
8. **Position is available?** – Decision node:
   - ✅ If yes → Send Slack notification and update tracking sheet.
   - ❌ If no → Send rejection email.
9. **Update Job Application Tracking Sheet** – Logs all relevant applicant data.
10. **Mark Email as Read** – At the end of every decision branch, this is implemented to prevent duplicate processing.

**Note:** Slack Actions for Shortlist/Decline are handled separately via a Google Apps Script endpoint to avoid workflow delays while waiting for user input.

---

## 4. Technical Notes

- **n8n nodes used:** Gmail Trigger, If, Extract from File, Read Doc, Set, LangChain Gemini, Google Drive, Google Sheets, Slack.
- **Google Apps Script:** Handles interactive Slack buttons (Shortlist/Decline) asynchronously.

## 5. User Guide

For detailed step-by-step instructions, setup requirements, and guidance for HR team members, please refer to the separate user documentation:

[USER_DOCUMENTATION.md](USER_DOCUMENTATION.md)
