// server.js
const { Pool } = require("pg");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

  
const PORT = process.env.PORT || 5000;

// Basit bir test endpoint'i
app.get("/", (req, res) => {
    res.send("Rezervasyon Sistemi API Çalışıyor!");
});
const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "rezervasyon_db",
    password: "Efsa2000.",
    port: 5432,
  });
// Rezervasyon ekleme endpoint'i
app.post("/reservations", async (req, res) => {
    const { name, date, time, phone } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO reservations (name, date, time, phone) VALUES ($1, $2, $3, $4) RETURNING *", 
            [name, date, time, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Rezervasyonları listeleme
app.get("/reservations", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM reservations ORDER BY date, time");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});
// Belirli bir rezervasyonu silme
app.delete("/reservations/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM reservations WHERE id = $1", [id]);
        res.status(200).json({ message: "Rezervasyon silindi!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
// Rezervasyon güncelleme
app.put("/reservations/:id", async (req, res) => {
    const { id } = req.params;
    const { name, date, time, phone } = req.body;
    try {
        const result = await db.query(
            "UPDATE reservations SET name=$1, date=$2, time=$3, phone=$4 WHERE id=$5 RETURNING *",
            [name, date, time, phone, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
app.get('/reservations/available-slots', (req, res) => {
    const { date, service } = req.query;

    if (!date || !service) {
        return res.status(400).json({ message: "Eksik parametreler: date ve service gereklidir." });
    }

    // Örnek: Boş slotları gösteren bir liste dönelim
    const availableSlots = [
        { time: "10:00" },
        { time: "11:00" },
        { time: "14:00" }
    ];

    res.json(availableSlots);
});


