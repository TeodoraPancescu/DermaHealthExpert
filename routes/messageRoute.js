const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");

router.post("/addMessage/", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            return res.json({ message: "Mesajul a fost adaugat cu succes", success: true });
        }
        else {
            return res.json({ message: "Eroare la adaugarea mesajului in baza de date", success: false });
        }
    } catch (ex) {
        next(ex);
    }
});

router.post("/getMessage/", async (req, res) => {
    try {
        const { from, to } = req.body;

        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json({ message: "Mesajele au fost returnate cu succes", success: true, data: projectedMessages });
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;