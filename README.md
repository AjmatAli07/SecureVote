# 🗳️ SecureVote – Online Voting System

A secure and modern web-based online voting system developed for conducting small district elections. The system provides role-based authentication, election management, secure voting, and result visualization using Supabase.

## 🚀 Features

### 👤 Voter
- Register and login securely
- Cast vote only once
- View available elections
- View election results after declaration

### 🧑‍💼 Election Official / Admin
- Login with admin role
- Create and manage elections
- Add candidates
- Publish election results
- Access secure admin panel

### 🔐 Security Features
- Role-based access control
- One user → one vote restriction
- Admin restricted from voting
- Session validation
- Supabase authentication

---

## 🛠 Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Supabase Authentication
- Supabase PostgreSQL Database

**Libraries**
- Chart.js

---

## 📂 Project Structure

```text
SecureVote/
│
├── index.html
├── login.html
├── register.html
├── vote.html
├── admin.html
├── results.html
│
├── css/
│   ├── style.css
│   ├── auth.css
│   ├── voting.css
│   ├── admin.css
│   └── results.css
│
├── js/
│   ├── auth.js
│   ├── admin.js
│   ├── vote.js
│   ├── results.js
│   ├── supabase.js
│   └── config.example.js
│
├── schema.sql
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

1. Clone repository

```bash
git clone https://github.com/yourusername/SecureVote.git
```

2. Open project folder

```bash
cd SecureVote
```

3. Create:

```text
js/config.js
```

Add:

```javascript
export const SUPABASE_URL = "YOUR_SUPABASE_URL";

export const SUPABASE_ANON_KEY =
"YOUR_SUPABASE_ANON_KEY";
```

4. Configure Supabase database tables

Run:

```sql
schema.sql
```

5. Launch with local server

Example:

VS Code → Live Server

---

## 📊 Results Dashboard

- Vote visualization using Chart.js
- Winner highlighting
- Result declaration control

---

## 🔮 Future Improvements

- OTP verification
- Live result updates
- District-wise election filtering
- AI-based fraud detection
- Better security policies

---

## 👨‍💻 Author

Ajmat Ali

B.Tech CSE
