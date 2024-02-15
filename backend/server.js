import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "88888",
  database: "parking",
});

app.get("/", (req, res) => {
  res.json("chal gya ye toh");
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    console.log(user);
    next();
  });
};

app.post("/SignUp", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    db.query(
      "INSERT INTO parking.user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            // Error code for duplicate entry (email already exists)
            return res.status(400).json({ error: "Email already exists" });
          }

          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ message: "User added successfully", id: result.insertId });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    db.query(
      "SELECT * FROM parking.user WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "your_secret_key",
          { expiresIn: "1y" }
        );

        res.json({ message: "Login successful", user, token });
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CRUD operations for floors
app.get("/floors", authenticateToken, (req, res) => {
  db.query("SELECT * FROM parking.floor", (err, data) => {
    if (err) {
      console.error("Error fetching floor:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.post("/floors", authenticateToken, (req, res) => {
  const { name, capacity } = req.body;
  db.query(
    "INSERT INTO parking.floor (name, capacity,user_id) VALUES (?, ?, ?)",
    [name, capacity, req.user.userId],
    (err, result) => {
      if (err) {
        console.error("Error inserting floor:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Floor added successfully", id: result.insertId });
    }
  );
});

app.put("/floors/:id", authenticateToken, (req, res) => {
  const { name, capacity } = req.body;
  const floorId = req.params.id;
  db.query(
    "UPDATE parking.floor SET name=?, capacity=? WHERE id=?",
    [name, capacity, floorId],
    (err, result) => {
      if (err) {
        console.error("Error updating floor:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Floor updated successfully" });
    }
  );
});

app.delete("/floors/:id", authenticateToken, (req, res) => {
  const floorId = req.params.id;
  db.query("DELETE FROM parking.floor WHERE id=?", [floorId], (err) => {
    if (err) {
      console.error("Error deleting floor:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Floor deleted successfully" });
  });
});

// CRUD operations for slots
app.get("/slots", authenticateToken, (req, res) => {
  db.query("SELECT * FROM parking.slots", (err, data) => {
    if (err) {
      console.error("Error fetching slots:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.post("/slots", authenticateToken, (req, res) => {
  const { name, type, floorId, occupied } = req.body;
  db.query(
    "INSERT INTO parking.slots (name, type, FloorID, occupied) VALUES (?, ?, ?, ?)",
    [name, type, floorId, occupied],
    (err, result) => {
      if (err) {
        console.error("Error inserting slot:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Slot added successfully", id: result.insertId });
    }
  );
});

app.put("/slots/:id", authenticateToken, (req, res) => {
  const { name, type, floorId, occupied } = req.body;
  const slotId = req.params.id;
  db.query(
    "UPDATE parking.slots SET name=?, type=?, FloorID=?, occupied=? WHERE id=?",
    [name, type, floorId, occupied, slotId],
    (err, result) => {
      if (err) {
        console.error("Error updating slot:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Slot updated successfully" });
    }
  );
});

app.delete("/slots/:id", authenticateToken, (req, res) => {
  const slotId = req.params.id;
  db.query("DELETE FROM parking.slots WHERE ID=?", [slotId], (err) => {
    if (err) {
      console.error("Error deleting slot:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Slot deleted successfully" });
  });
});

app.get("/slots/available", authenticateToken, (req, res) => {
  db.query(
    "SELECT * FROM parking.slots WHERE occupied = false",
    (err, data) => {
      if (err) {
        console.error("Error fetching available slots:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(data);
    }
  );
});

//Accessing slots fro parking
app.post("/accessParking", authenticateToken, (req, res) => {
  const { name, selectedSlot, car_number } = req.body;

  db.query(
    "INSERT INTO parking.cdetails (name, slot_id , car_number) VALUES (?, ?, ?)",
    [name, selectedSlot, car_number],
    (err, result) => {
      console.log("'ye chla", result);
      if (err) {
        console.error("Error inserting into Cdetails:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "Parking access successful", id: result.insertId });
    }
  );
});

// Update Occupancy route
app.put("/slots/updateOccupancy/:id", authenticateToken, (req, res) => {
  const slotId = req.params.id;
  const { occupied } = req.body;

  // Update the occupied status in the slots table
  db.query(
    "UPDATE parking.slots SET occupied = ? WHERE ID = ?",
    [occupied, slotId],
    (err) => {
      if (err) {
        console.error("Error updating slot occupancy:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "Slot occupancy updated successfully" });
    }
  );
});

app.get("/cdetails/all", authenticateToken, (req, res) => {
  // Fetch all records from the cdetails table
  db.query("SELECT * FROM parking.cdetails", (err, data) => {
    if (err) {
      console.error("Error fetching cdetails:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(data);
  });
});

app.delete("/cdetails/delete/:carNumber", authenticateToken, (req, res) => {
  const carNumber = req.params.carNumber;

  db.query(
    "DELETE FROM parking.cdetails WHERE car_number = ?",
    [carNumber],
    (err, result) => {
      if (err) {
        console.error("Error deleting from Cdetails:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.json({ message: "Parking session ended successfully" });
    }
  );
});

app.listen(8800, () => {
  console.log("Running.....");
});
