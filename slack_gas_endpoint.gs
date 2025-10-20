//Exported from the Google Apps Script IDE for reference

const SLACK_BOT_TOKEN = PropertiesService.getScriptProperties("SLACK_BOT_TOKEN");
const JOB_APP_SHEET_ID = PropertiesService.getScriptProperties("JOB_APP_SHEET_ID");
const STATUS_COL = 15;    // Column O
const REVIEWER_COL = 16;  // Column P

function doPost(e) {
  try {
    let payload = JSON.parse(e.parameter.payload);
    let status = getStatusFromAction(payload.actions[0].action_id);

    updateGoogleSheet(payload.actions[0].value, status, payload.user.id);
    sendEmailToApplicant(payload.actions[0].value, status);
    removeSlackButtons(payload);

    return respondToSlack("Status updated to: " + status);
  } catch (error) {
    console.error(error);
    logToSheet(error);
    return respondToSlack("Error processing the action.");
  }
}

// === HELPER FUNCTIONS ===
function getStatusFromAction(actionId) {
  if (actionId === "shortlist_button") return "Shortlisted";
  if (actionId === "decline_button") return "Declined";
  throw new Error("Unknown action_id: " + actionId);
}

function updateGoogleSheet(applicationId, status, reviewerId) {
  const sheet = SpreadsheetApp.openById(JOB_APP_SHEET_ID).getSheetByName("Sheet1");
  const appIds = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
  const rowIndex = appIds.findIndex(row => row[0] === applicationId);
  
  if (rowIndex === -1) {
    throw new Error("Application ID not found in sheet: " + applicationId);
  }

  const actualRow = rowIndex + 2; //header is row 1 and range started from row 2
  sheet.getRange(actualRow, STATUS_COL).setValue(status);
  sheet.getRange(actualRow, REVIEWER_COL).setValue(reviewerId);
}

function sendEmailToApplicant(threadId, status) {
  try {
    let thread = GmailApp.getThreadById(threadId);
    if (!thread) {
      console.error("Gmail thread not found: " + threadId);
      return;
    }

    let recruiterMessage = status==="Shortlisted"? "A recruiter will be in contact with you soon.":"We hope you can find a better offer in the future."

    thread.reply(
      `Dear applicant,\n\nYour application status has been updated to: ${status}.
      \n\n${recruiterMessage} Thank you for applying.`
    );

    console.log("Replied to thread " + threadId + " successfully.");
  } catch (err) {
    console.error("Error sending email to applicant: " + err);
  }
}

function removeSlackButtons(payload) {
  let statusText = getStatusFromAction(payload.actions[0].action_id);
  let updatedBlocks = payload.message.blocks.map(function(block) {
    if (block.type === "actions") {
      return {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Applicant status has been changed to: *${statusText}*`
        }
      };
    }
    return block;
  });

  let messageTs = payload.message.ts;
  let channelId = payload.channel.id;

  let options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + SLACK_BOT_TOKEN},
    payload: JSON.stringify({
      channel: channelId,
      ts: messageTs,
      text: payload.message.text, // keep original text
      blocks: updatedBlocks // update buttons, change to status
    })
  };
  UrlFetchApp.fetch("https://slack.com/api/chat.update", options);
}

function respondToSlack(message) {
  return ContentService.createTextOutput(JSON.stringify({ text: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
