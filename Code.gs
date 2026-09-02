/**
 * BharatTrip Refund Operations Portal Backend (Code.gs)
 * Customized to user's exact sheet column schema (snake_case headers)
 */

const CONFIG = {
  SHEET_NAME: "Master_Refund_Tracker", // Or active sheet name
  ROLES: {
    SUPPORT: [
      "rakesh@bharattrip.com", "aditi@bharattrip.com", "priya@bharattrip.com",
      "faizan@bharattrip.com", "sneha@bharattrip.com", "vikram@bharattrip.com",
      "support@bharattrip.com"
    ],
    FINANCE: [
      "iyer@bharattrip.com", "bhatt@bharattrip.com", "menon@bharattrip.com",
      "finance@bharattrip.com"
    ],
    ADMIN: [
      "ops-lead@bharattrip.com", "sahilansari98355@gmail.com", "admin@bharattrip.com"
    ]
  }
};

function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail() || "sahilansari98355@gmail.com";
  const template = HtmlService.createTemplateFromFile("index");
  template.userEmail = userEmail;
  template.userRole = getUserRole(userEmail);
  
  return template.evaluate()
    .setTitle("BharatTrip - Refund Operations Portal")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getUserRole(email) {
  const cleanEmail = String(email).toLowerCase().trim();
  if (CONFIG.ROLES.ADMIN.includes(cleanEmail)) return "ADMIN";
  if (CONFIG.ROLES.FINANCE.includes(cleanEmail)) return "FINANCE";
  if (CONFIG.ROLES.SUPPORT.includes(cleanEmail)) return "SUPPORT";
  if (cleanEmail.includes("fin")) return "FINANCE";
  if (cleanEmail.includes("sup")) return "SUPPORT";
  return "ADMIN";
}

/**
 * Fetch all tickets matching your exact column names
 */
function getTickets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const tickets = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    
    const item = { rowIndex: i + 1 };
    headers.forEach((h, colIdx) => {
      item[h] = row[colIdx] instanceof Date ? formatDate(row[colIdx]) : row[colIdx];
    });
    tickets.push(item);
  }
  return tickets;
}

/**
 * Support verifies ticket and pushes to Finance queue
 */
function supportVerifyTicket(ticketId, handlerEmail, notes) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase().trim());
    
    const statusCol = headers.indexOf("status") + 1;
    const handledByCol = headers.indexOf("handled_by") + 1;
    const payoutStatusCol = headers.indexOf("payout_status") + 1;
    const notesCol = headers.indexOf("notes") + 1;
    const lastUpdatedCol = headers.indexOf("last_updated") + 1;
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(ticketId).trim()) {
        const r = i + 1;
        if (statusCol > 0) sheet.getRange(r, statusCol).setValue("Verified by Support");
        if (handledByCol > 0) sheet.getRange(r, handledByCol).setValue(handlerEmail || "Support Agent");
        if (payoutStatusCol > 0) sheet.getRange(r, payoutStatusCol).setValue("Queued for Finance");
        if (notesCol > 0 && notes) sheet.getRange(r, notesCol).setValue(notes);
        if (lastUpdatedCol > 0) sheet.getRange(r, lastUpdatedCol).setValue(formatDate(new Date()));
        
        return { success: true, message: `Ticket ${ticketId} verified and pushed to Finance Queue!` };
      }
    }
    return { success: false, message: `Ticket ${ticketId} not found.` };
  } catch(e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Finance settles payout with deduction
 */
function financeSettlePayout(ticketId, amountPaid, deduction, approverEmail, remarks) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase().trim());
    
    const statusCol = headers.indexOf("status") + 1;
    const deductionCol = headers.indexOf("deduction") + 1;
    const amountPaidCol = headers.indexOf("amount_paid") + 1;
    const payoutStatusCol = headers.indexOf("payout_status") + 1;
    const approvedByCol = headers.indexOf("approved_by") + 1;
    const notesCol = headers.indexOf("notes") + 1;
    const lastUpdatedCol = headers.indexOf("last_updated") + 1;
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(ticketId).trim()) {
        const r = i + 1;
        if (statusCol > 0) sheet.getRange(r, statusCol).setValue("Refund Settled");
        if (deductionCol > 0) sheet.getRange(r, deductionCol).setValue(Number(deduction) || 0);
        if (amountPaidCol > 0) sheet.getRange(r, amountPaidCol).setValue(Number(amountPaid));
        if (payoutStatusCol > 0) sheet.getRange(r, payoutStatusCol).setValue("Refund Settled");
        if (approvedByCol > 0) sheet.getRange(r, approvedByCol).setValue(approverEmail || "Finance Officer");
        if (notesCol > 0 && remarks) sheet.getRange(r, notesCol).setValue(remarks);
        if (lastUpdatedCol > 0) sheet.getRange(r, lastUpdatedCol).setValue(formatDate(new Date()));
        
        return { success: true, message: `Payout of ₹${amountPaid} settled for ${ticketId}. n8n Message 2 notification queued!` };
      }
    }
    return { success: false, message: `Ticket ${ticketId} not found.` };
  } catch(e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Finance declines refund with mandatory policy reason
 */
function financeDeclineRefund(ticketId, reasonCode, approverEmail, notes) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase().trim());
    
    const statusCol = headers.indexOf("status") + 1;
    const amountPaidCol = headers.indexOf("amount_paid") + 1;
    const payoutStatusCol = headers.indexOf("payout_status") + 1;
    const approvedByCol = headers.indexOf("approved_by") + 1;
    const notesCol = headers.indexOf("notes") + 1;
    const lastUpdatedCol = headers.indexOf("last_updated") + 1;
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(ticketId).trim()) {
        const r = i + 1;
        const fullReason = `${reasonCode}: ${notes || 'Declined as per airline tariff rules.'}`;
        
        if (statusCol > 0) sheet.getRange(r, statusCol).setValue("Declined");
        if (amountPaidCol > 0) sheet.getRange(r, amountPaidCol).setValue(0);
        if (payoutStatusCol > 0) sheet.getRange(r, payoutStatusCol).setValue("Declined");
        if (approvedByCol > 0) sheet.getRange(r, approvedByCol).setValue(approverEmail || "Finance Officer");
        if (notesCol > 0) sheet.getRange(r, notesCol).setValue(fullReason);
        if (lastUpdatedCol > 0) sheet.getRange(r, lastUpdatedCol).setValue(formatDate(new Date()));
        
        return { success: true, message: `Ticket ${ticketId} marked Declined. n8n Message 2 notification queued!` };
      }
    }
    return { success: false, message: `Ticket ${ticketId} not found.` };
  } catch(e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function formatDate(d) {
  if (!d) return "";
  try {
    return Utilities.formatDate(new Date(d), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm");
  } catch(e) {
    return String(d);
  }
}
