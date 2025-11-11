import admin from "../config/firebase.js";

const doctors = {
  D101: "123",
  D102: "1234",
  D103: "12345",
  D104: "123456",
  D105: "1234567",
  D106: "12345678",
  D107: "123456789"
};

const nurses = {
  N101: "123",
  N102: "1234",
  N103: "12345",
  N104: "123456",
  N105: "1234567",
  N106: "12345678",
  N107: "123456789"
};

export const login = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (doctors[id] === password) {
      return res.json({ role: "doctor", id });
    } else if (nurses[id] === password) {
      return res.json({ role: "nurse", id });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
