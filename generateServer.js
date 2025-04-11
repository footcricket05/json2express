const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "configs", "example.json");
const outputPath = path.join(__dirname, "output", "server.js");

const readJSONConfig = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Failed to read or parse JSON:", err);
    process.exit(1);
  }
};

const generateServerCode = (config) => {
  const nodes = config.nodes;
  const idToNode = {};
  nodes.forEach((node) => (idToNode[node.id] = node));

  const lines = [];
  lines.push(`const express = require("express");`);
  lines.push(`const cors = require("cors");`);
  lines.push(`const app = express();`);
  lines.push(``);
  lines.push(`app.use(cors({ origin: "*" }));`);
  lines.push(`app.use(express.json());`);
  lines.push(``);

  // Middleware definitions
  lines.push(`const authMiddleware = (req, res, next) => {`);
  lines.push(`  if (!req.headers.authorization) {`);
  lines.push(`    return res.status(401).json({ message: "Unauthorized" });`);
  lines.push(`  }`);
  lines.push(`  next();`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`const adminMiddleware = (req, res, next) => {`);
  lines.push(`  if (req.headers.authorization !== "admin") {`);
  lines.push(`    return res.status(403).json({ message: "Forbidden" });`);
  lines.push(`  }`);
  lines.push(`  next();`);
  lines.push(`};`);
  lines.push(``);

  const getMiddlewares = (nodeId) => {
    const middlewares = [];

    let current = idToNode[nodeId]?.source;
    while (current) {
      const parent = idToNode[current];
      if (!parent) break;

      if (parent.properties.type === "middleware") {
        if (parent.properties.auth_required) middlewares.push("authMiddleware");
        if (parent.properties.admin_required) middlewares.push("adminMiddleware");
        if (parent.properties.log_requests) middlewares.push("// Logging middleware placeholder");
      }

      current = parent.source;
    }

    return middlewares.reverse();
  };

  nodes.forEach((node) => {
    if (node.properties.endpoint && node.properties.method) {
      const method = node.properties.method.toLowerCase();
      const endpoint = node.properties.endpoint;
      const middlewares = getMiddlewares(node.id);

      const middlewareString = middlewares.length > 0 ? middlewares.join(", ") + ", " : "";
      lines.push(`app.${method}("${endpoint}", ${middlewareString}(req, res) => res.json({ message: "${node.name}" }));`);
    }
  });

  lines.push(``);
  lines.push(`app.listen(3000, () => console.log("Server running on port 3000"));`);

  return lines.join("\n");
};

const config = readJSONConfig(configPath);
const serverCode = generateServerCode(config);
fs.writeFileSync(outputPath, serverCode);
console.log("✅ server.js generated successfully!");
