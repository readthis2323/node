import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // 👈 si estás en Node.js < 18

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.APIKEY;
const CHAT_ID = process.env.CHATID;

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket.remoteAddress;

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const data = {
    chat_id: CHAT_ID,
    text: `<b>Mensaje recibido:</b> ${message}\n<b>IP:</b> ${ip}`,
    parse_mode: "HTML",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    res.status(200).json({
      message: "Message sent successfully",
      ip,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});
