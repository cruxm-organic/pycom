# PyCom

A platform to learn Python and build models.

## Architecture

- **Frontend**: React 19 + Vite, unchanged from the original design.
- **Backend**: Python (FastAPI) owns all AI-powered features. The browser never talks to a model
  provider directly and never sees an API key.
- **AI provider**: swappable via one environment variable (`AI_PROVIDER=gemini|claude|openai`).
  Application code depends on a single internal interface (`backend/app/providers/base.py`), not
  on any one vendor's SDK, so switching providers is a config change.

Only the Data Structure Dilemma quiz game runs through this backend so far. The rest of the
platform's AI features (AI Lab, Investor Chatbot, PyPing, sales-AI dashboard) are being migrated
to the same pattern incrementally and still call Gemini directly from the browser for now.

## Security

- API key lives server-side only, in `backend/.env`, never bundled into client code.
- Rate limiting on AI-backed endpoints (20 requests/minute per client).
- Output from every provider is schema-validated before it reaches the frontend; a malformed or
  failed response falls back to a safe default rather than breaking the UI.
- Every AI-backed request is logged with a hashed client identifier, provider, and outcome, not
  raw IPs, to `backend/audit.log`.

## Run locally

**Backend**
```
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in AI_PROVIDER and AI_API_KEY
python -m uvicorn app.main:app --port 8000
```

**Frontend**
```
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`.
