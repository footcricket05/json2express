const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.headers.authorization !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

app.post("/login", authMiddleware, (req, res) => res.json({ message: "Login Route" }));
app.post("/signup", authMiddleware, (req, res) => res.json({ message: "Signup Route" }));
app.post("/signout", authMiddleware, (req, res) => res.json({ message: "Signout Route" }));
app.get("/user", authMiddleware, (req, res) => res.json({ message: "User Route" }));
app.get("/admin", authMiddleware, adminMiddleware, (req, res) => res.json({ message: "Admin Route" }));
app.get("/home", (req, res) => res.json({ message: "Home Page" }));
app.get("/about", (req, res) => res.json({ message: "About Page" }));
app.get("/news", (req, res) => res.json({ message: "News Page" }));
app.get("/blogs", (req, res) => res.json({ message: "Blogs Page" }));

app.listen(3000, () => console.log("Server running on port 3000"));