# User Documentation – AI-Powered Job Application Automation

This guide outlines the steps to prepare and use the AI-powered job application automation. Separate instructions are provided for technical and non-technical users.

---

## Quick Checklist

### Non-Technical Users
- [ ] HR email account ready to receive applications  
- [ ] Access to Slack channel for notifications  
- [ ] Access to Google Sheets tracker  

### Technical Users
- [ ] Gmail API / OAuth2 credentials  
- [ ] Google Drive API / OAuth2 credentials  
- [ ] Google Sheets API / OAuth2 credentials  
- [ ] Google Gemini AI Key  
- [ ] Slack API token  
- [ ] Google Apps Script Endpoint deployed  

---

## 1. End Users (Non-Technical Users)

### What You Need
- An HR email account where applicants send their resumes.
- Access to the dedicated Slack channel for application notifications.
- Access to the Google Sheets tracking sheet for job applications.

### Quick Setup
1. Make sure the HR email account is ready and able to receive job applications.
2. Confirm that the Slack channel exists and you have permission to post messages.
3. Ensure the Google Sheets tracker exists and you have view/edit access.

**Usage Notes:**  
Once the system is running, new applications will automatically:
- Be parsed and analyzed.
- Notify the Slack channel with applicant information.
- Update the tracking sheet.
- Notify applicants if the position is unavailable.

---

## 2. Workflow Managers (Technical Users)

### What You Need
- **Gmail API / OAuth2 credentials**: Allows n8n to read emails from the HR mailbox.
- **Google Drive API / OAuth2 credentials**: Needed to retrieve resumes.
- **Google Sheets API / OAuth2 credentials**: Required to update the job application tracker.
- **Google Gemini AI Key**: Required for AI-based parsing and analysis of resumes and cover letters.
- **Slack API Token**: To send notifications and enable interactive buttons.
- **Google Apps Script Endpoint URL**: Handles Shortlist/Decline decisions asynchronously to prevent workflow delays.

### Setup Steps
1. Configure API keys and credentials in n8n:
   - Gmail, Google Drive, Google Sheets, and Google Gemini AI.
   - Slack API token for posting notifications.
2. Ensure the Google Apps Script endpoint is deployed and accessible.
3. Connect all credentials to their respective nodes in the n8n workflow.
4. Verify access to the HR email, Slack channel, and Google Sheets tracker.
5. Test the workflow with a sample email to confirm:
   - Resume parsing and AI extraction work correctly.
   - Slack notification is sent.
   - Tracking sheet is updated.
   - Shortlist/Decline actions are handled asynchronously.
  
### For local instance deployment
1. Install Docker on your system (if you haven't already).
2. Secure a copy of the `docker-compose.yaml` file from the administrator and place it in your desired working directory.
3. Open your Command Prompt/Terminal.
4. Inside the terminal/console, navigate to your desired n8n local working directory (the directory where you placed the `docker-compose.yaml` file.
5. Execute the command `docker compose up -d`and wait for it to finish.
6. Access the local instance by entering this link `http://localhost:5678/` in the browser.

---

## 3. Important Notes
- Keep all API keys and OAuth credentials secure.  
- Do not expose credentials in public repositories.  
- Ensure email attachments are in supported formats: PDF, DOC, DOCX.  
- Workflow assumes the Slack actions (Shortlist/Decline) are handled separately via the Google Apps Script endpoint.  
