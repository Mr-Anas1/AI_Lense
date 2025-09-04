# 📝 AI Legal Lens

*Simplifying Legal Documents with Generative AI*

---

## 📌 Overview

Legal documents like rental agreements or contracts are often long, filled with jargon, and difficult for everyday people to understand.
**AI Legal Lens** is a web-based tool that uses **Google Gemini** to make these documents easy to read.

Upload a PDF → Get simplified clauses, plain English explanations, and highlighted risks → Ask questions or search specific terms.

This makes legal information **clear, accessible, and less intimidating** for everyone.

---

## ✨ Features

* 📂 **Upload PDFs** – Upload tenancy agreements, rental contracts, or ToS.
* 🔍 **Clause Categorization** – Clauses tagged as **Safe**, **Doubtful**, or **Needs Attention**.
* 💡 **Plain English Explanations** – Simple, everyday language for each clause.
* ⚠️ **Risk Detection** – Important risks highlighted separately.
* 🔎 **Smart Search** – Find specific clauses or keywords instantly.
* 💬 **Interactive Q\&A** – Ask follow-up questions about any clause.
* 📑 **Export Option** – Download simplified summaries as a PDF.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TailwindCSS
* **Document Parsing:** pdf.js
* **AI Analysis:** Google Gemini API (1.5 Flash)
* **Hosting:** Vercel (Free)

---

## ⚙️ How It Works

1. User uploads a **PDF document**.
2. **pdf.js** extracts the raw text.
3. Extracted text is sent to **Gemini** for analysis.
4. Gemini returns:

   * Simplified clauses
   * Categorization (Safe, Doubtful, Needs Attention)
   * Risks & plain-language explanations
5. User views results in a **clean, interactive dashboard**.

---

## 📈 Scalability

In the future, the system can be extended to cover:

* Employment agreements
* Service contracts
* Non-Disclosure Agreements (NDAs)
* Loan agreements

With **Gemma fine-tuning in Vertex AI**, the model can be further specialized for legal use cases.

---

## 🎯 USP

* Goes beyond summarization → **categorizes clauses + flags risks**
* Provides **interactive search and Q\&A** for user-specific queries
* **Confidential & user-friendly**, tailored for non-lawyers

---

## 🚀 Getting Started

1. Clone the repo

   ```bash
   git clone https://github.com/your-username/ai-legal-lens.git
   cd ai-legal-lens
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Add your **Google API Key** in `.env.local`:

   ```
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

---

## 📸 Screenshots

*(Add your MVP screenshots here for extra impact)*

---

## 🙌 Acknowledgements

* [Google Gemini](https://ai.google/) for generative AI
* [pdf.js](https://mozilla.github.io/pdf.js/) for PDF parsing
* Hackathon mentors for guidance

---
