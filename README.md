# ✈️ BharatTrip • AI Refund Operations Hub

[![n8n](https://img.shields.io/badge/Workflow-n8n_Cloud-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![OpenAI](https://img.shields.io/badge/AI_Engine-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Google Apps Script](https://img.shields.io/badge/Portal-Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![Google Sheets](https://img.shields.io/badge/Database-Google_Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)](https://sheets.google.com)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> **An AI Operations solution designed for BharatTrip to reconcile fragmented spreadsheets, capture off-tracker travel agent requests, and reduce refund escalations from 51.4% to <5% with zero new headcount.**

---

## 📌 Repository Structure

```plaintext
├── workflows/
│   └── n8n_refund_all_in_one_workflow.json   # Complete n8n workflow export (Intake + Watcher)
├── apps-script/
│   ├── Code.gs                               # Backend: LockService, Email RBAC, State Machine
│   └── index.html                            # Frontend: Tailwind UI, Deduction Modals, Drawer
├── analysis/
│   ├── reconciliation_analysis.py            # Python script verifying tracker gaps & mismatches
│   └── problem_definition.md                 # Data-backed diagnosis of the June escalation surge
└── README.md                                 # System documentation & deployment guide
