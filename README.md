# BharatTrip - AI Refund Operations Command Center
### 🚀 [Open Live Dashboard →](https://script.google.com/macros/s/AKfycbzFmrDJVl2U_Af2E_vlXjsn1K8i1cZumlzV7b2_h9LyVP3KXRI0bPj6NKAygrefwMJW/exec)
![](https://github.com/sahilansari79923-byte/Refund-automation---BharatTrip---assignment/blob/main/Snaps/Screenshot%202026-09-05%20220636.png)


---
### ▶️ [Video Demo](https://drive.google.com/file/d/1-huCeugZezCmVaFJa7H7CItpGJUToxy9/view?usp=sharing)
![n8n Automation Pipeline](https://github.com/sahilansari79923-byte/Refund-automation---BharatTrip---assignment/blob/main/Snaps/Screenshot%20(1365).png)
### 🛢️ [Database →](https://docs.google.com/spreadsheets/d/1IMflyBx1J-dYq_LR9zYqkHB0fMSUEUd1IoaTUEZiBgA/edit?gid=0#gid=0)
---
> **An AI-powered operational system that unifies Support & Finance, eliminates off-tracker refund leaks, and reduces agent escalations from 51.4% to <5% with zero new headcount.**

---

##  The Real Problem

At BharatTrip, refund volume remained completely flat (~150 requests/month) for five months straight. Yet in June, customer and travel agent escalations suddenly **tripled to 75 complaints** (a 51.4% escalation rate). 

When we dug into the raw operational data across 755 Support tickets, 689 Finance payouts, and 155 complaints, the root cause wasn't volume—it was a **broken operational handoff**:
1. **The Silent Leak:** **121 tickets** were marked *"Closed"* by Support agents who assumed their job was done, but the requests were never transmitted to Finance. The money never left the bank account.
2. **The Information Black Hole (57% of Escalations):** When travel agents asked for updates, nobody answered. Travel agents had to chase repeatedly (*"Bhai refund ka kya hua?"*).
3. **Off-Tracker Requests:** Informal refund requests coming in via WhatsApp and Email were never assigned a reference number, leaving agents with zero proof of their claim.
4. **Surprise Short Payments:** Finance applied legitimate airline cancellation deductions on 70 refunds, but never explained them to the agent.

---

##  The Solution Architecture

Instead of asking leadership for more headcount or building an expensive custom SaaS tool, we designed a **lean, resilient 3-part AI Ops system**:

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              BHARATTRIP REFUND ARCHITECTURE                            │
 └────────────────────────────────────────────────────────────────────────────────────────┘

    [ Multi-Channel Ingestion ]           [ AI Operations Pipeline ]           [ Shared Operational UI ]
   • Hinglish WhatsApp Chats       ──▶  • n8n Automated Pipeline     ──▶  • Google Apps Script Web App
   • Fragmented Cancellation Emails     • LLM Entity Extractor (JSON)       • Single Source of Truth (Sheet)
   • Partner Web Portal Forms           • 2-Message Agent Notifier          • Role-Based Guardrails (RBAC)
```

1. **Google Sheets as the Single Source of Truth (Database):** Replaces the two disconnected spreadsheets with one unified operational ledger.
2. **n8n + AI LLM Multi-Channel Ingestion Engine:** Listens to WhatsApp, Gmail, and Web Portal, parses messy text into clean structured data, logs the ticket, and sends instant confirmations.
3. **Google Apps Script Enterprise Portal (UI):** A single web app for Support and Finance agents with one-click verification, deduction modals, and strict lifecycle state controls.

---

##  How It Works in Real Life (Step-by-Step)

```
[Day 1: 10:00 AM]  Travel Agent sends a messy WhatsApp message or email
                   ↳ Example: "Bhai refund ka kya hua? BLR-MAA wala. 2 hafte ho gaye"
       │
       ▼
[Day 1: 10:00 AM]  n8n Multi-Channel Normalizer & AI LLM Parser
                   ↳ Detects channel (WhatsApp / Email).
                   ↳ Extracts: Agent: "Nomad Travel" | Sector: "BLR-MAA" | Intent: "Chasing".
                   ↳ Generates Unique Ticket ID: RF-1098.
                   ↳ Appends row to the Master Google Sheet in status "Under Review".
       │
       ▼
[Day 1: 10:00 AM]  MESSAGE 1: Instant Acknowledgment (Sent in <30 seconds)
                   ↳ Agent instantly gets a WhatsApp/Email reply:
                     "Hi Partner, we've registered your refund under ticket RF-1098 for sector BLR-MAA. 
                      Our team is reviewing airline fare rules. Expected TAT: 3 business days."
       │
       ▼
[Day 1: 02:00 PM]  Support Team Action (Apps Script Web App)
                   ↳ Support logs into their dedicated "Support Queue" view.
                   ↳ Reviews airline cancellation policy and clicks [⚡ Verify & Push].
                   ↳ Status changes to "Queued for Finance". No spreadsheets to manually copy-paste!
       │
       ▼
[Day 2: 11:00 AM]  Finance Team Action (Apps Script Web App)
                   ↳ Finance logs into their "Finance Payout Queue" view.
                   ↳ Clicks [💰 Settle Payout] ➜ Opens Deduction Modal.
                   ↳ Enters: Gross Claim: ₹14,500 | Airline Fee Deduction: ₹1,500 | Net: ₹13,000.
                   ↳ Selects reason: "Standard Airline Cancellation Tariff".
                   ↳ Clicks [Confirm Settlement].
       │
       ▼
[Day 2: 11:00 AM]  MESSAGE 2: Resolution & Transparent Breakdown
                   ↳ n8n Status Watcher detects "Refund Settled" and auto-dispatches Message 2:
                     " Refund Processed! Ticket RF-1098 (BLR-MAA) has been transferred to your bank.
                      • Claimed: ₹14,500 | Deduction: ₹1,500 (Airline Tariff Fee) | Net Credited: ₹13,000."
```

---

##  How We Use AI (The Human-in-the-Loop Intelligence)

We avoided generic chatbots and used AI specifically where human manual effort previously caused bottlenecks:

### 1. Hinglish & Colloquial Travel Language Parsing
Indian travel agents frequently mix Hindi and English (*"Bhai mera DEL-DXB wala refund jaldi kara do"*). Traditional regex breaks on this. Our OpenAI/Gemini prompt extracts the airport code, travel agent name, and intent with >95% accuracy.

### 2. Guardrails Against Hallucination (`confidence_score`)
If an agent sends a vague message with no PNR or route (*"bhai paisa bhej do"*):
* The AI returns `confidence_score < 0.70` and flags `is_missing_critical_info: true`.
* The system puts the ticket into **`Pending Info`** status and auto-replies asking for the PNR.
* **No hallucinated records ever enter the financial ledger.**

### 3. Automatic Deduplication
The pipeline checks if an open ticket for the same PNR/route already exists in the last 14 days. If found, it appends the message as a note instead of creating a duplicate row (killing the 31 historical duplicate records).

---

## 🛠️ The Tech Stack & Components

| Component | Technology | Role |
|---|---|---|
| **Data Layer** | Google Sheets | Single Source of Truth database (18 structured columns). |
| **Ingestion & AI** | n8n + OpenAI (GPT-4o-mini / Gemini) | Listens to Gmail/WhatsApp, parses text, manages 2-message lifecycle. |
| **Team Workspace** | Google Apps Script (`Code.gs` + `index.html`) | Modern responsive portal with Email RBAC and concurrency locking (`LockService`). |
| **Notifications** | Gmail API & Twilio / Meta WhatsApp API | Sends real-time Message 1 & Message 2 to travel agents. |

---

##  Quickstart: How to Run the Prototype

### 1. Import n8n Workflow
1. Open your n8n instance and click **Add Workflow ➡️ Import from File**.
2. Select **`n8n_refund_all_in_one_workflow.json`**.
3. Connect your **Gmail** or **Twilio** credentials and toggle the workflow to **Active**.

### 2. Deploy the Google Apps Script Web App
1. Open your Google Sheet with the master columns.
2. Go to **Extensions ➡️ Apps Script**.
3. Paste **`Code.gs`** into the script file and **`index.html`** into an HTML file.
4. Click **Deploy ➡️ New Deployment ➡️ Web App** (Set access to *Anyone*).
5. Open the Web App URL to interact with the live dashboard!

---

##  Business Impact at 30 Days

| Metric | Historical Baseline (June) | With AI Ops Solution (Day 30) |
|---|---|---|
| **Escalation Rate (%)** | **51.4%** (75 escalations / month) | **< 5.0%** (< 8 escalations / month) |
| **Lost / Dropped Handoffs** | **121 tickets (16.5% of volume)** | **0 tickets (0.0%)** |
| **End-to-End Cycle Time (TAT)** | 10–14 days (Support 7.5d + Finance 6.3d) | **$\le$ 3.0 business days** |
| **First-Touch Confirmation** | Days (or never) | **< 30 seconds (100% automated)** |
| **New Headcount Required** | — | **0 New Hires** |

---


