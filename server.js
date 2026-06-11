import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*', // Sostituisci con l'URL esatto del tuo frontend
  methods: 'GET,POST,PUT,DELETE',  // Metodi HTTP consentiti
  allowedHeaders: ['Content-Type', 'Authorization'], // Header accettati (fondamentale per i Token JWT!)
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

const PORT = 3000;
const SECRET_KEY = "chiave_segreta_per_i_token";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestionale',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users SET username = ?, password = ?', [username, hashedPassword]);

    //users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "Utente registrato!" });
});

// 2. LOGIN (Generazione Token)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Eseguiamo la query usando il pool
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        // Se l'array è vuoto, l'username non esiste
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenziali errate" });
        }

        // controllo password
        const user = rows[0];
        const passwordCorretta = await bcrypt.compare(password, user.password);
        if (!passwordCorretta) {
            return res.status(401).json({ message: "Credenziali errate" }); // Messaggio generico per sicurezza
        }

        // Generazione del Token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        // Risposta al frontend
        res.json(token);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server durante la lettura' });
    }



    // const user = users.find(u => u.username === username);
    // if(!user || password != user.password){
    //     return res.status(401).json({ message: "Credenziali errate" });
    // }
    // // if (!user || !(await bcrypt.compare(password, user.password))) {
    // //     return res.status(401).json({ message: "Credenziali errate" });
    // // }
    // // Genera il token valido per 1 ora
    // const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    // res.json({ token });


});

app.get('/api/users', async (req, res) => {
    try {
        // Eseguiamo la query usando il pool
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server durante la lettura' });
    }
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});