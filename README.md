### 📄 `README.md`

```markdown
# 🚀 Nervesparks Server Generator

This project is a simple Node.js-based server generator that reads a structured JSON file and automatically generates a working Express.js server. It supports route creation, middleware, and access control (auth/admin).

---

## 📁 Folder Structure

```
nervesparks-server-generator/
├── generateServer.js        # Script that reads config and generates server
├── configs/
│   └── example.json         # Sample configuration
├── output/
│   └── server.js            # Auto-generated Express.js server
├── package.json             # Project dependencies
└── README.md                # You're here!
```

---

## 🛠️ Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate the server**
   ```bash
   node generateServer.js
   ```

3. **Run the generated server**
   ```bash
   cd output
   node server.js
   ```

---

## 📥 Sample Configuration (configs/example.json)

```json
{
  "port": 3000,
  "routes": [
    {
      "method": "GET",
      "path": "/home",
      "handler": "Home Page",
      "authRequired": false
    },
    {
      "method": "POST",
      "path": "/login",
      "handler": "Login Route",
      "authRequired": true
    },
    {
      "method": "GET",
      "path": "/admin",
      "handler": "Admin Route",
      "authRequired": true,
      "adminOnly": true
    }
  ]
}
```

---

## 🧪 Test Routes with `curl`

### 🟢 Public Route – No Auth
```bash
curl http://localhost:3000/home
```
➡️ Response:
```json
{"message":"Home Page"}
```

---

### 🔐 Auth Required
```bash
curl -X POST -H "Authorization: testtoken" http://localhost:3000/login
```
➡️ Response:
```json
{"message":"Login Route"}
```

---

### 🔐 Admin Access
✅ **Admin Token:**
```bash
curl -H "Authorization: admin" http://localhost:3000/admin
```
➡️ Response:
```json
{"message":"Admin Route"}
```

🚫 **Non-Admin Token:**
```bash
curl -H "Authorization: notadmin" http://localhost:3000/admin
```
➡️ Response:
```json
{"message":"Forbidden"}
```

---

## ✅ Features

- Generates REST API server from JSON
- Supports middleware-based authentication
- Custom handlers from config
- Fast setup, no hardcoding

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

MIT License

