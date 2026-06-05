import http from 'node:http';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*', // Sostituisci con l'URL esatto del tuo frontend
  methods: 'GET,POST,PUT,DELETE',  // Metodi HTTP consentiti
  allowedHeaders: ['Content-Type', 'Aux\thorization'], // Header accettati (fondamentale per i Token JWT!)
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

const PORT = 3000;
const SECRET_KEY = "chiave_segreta_per_i_token";

const users = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "marco_bianchi", password: "password456", role: "user" },
  { username: "giulia_verdi", password: "password789", role: "user" },
  { username: "luca_neri", password: "passwordabc", role: "moderator" },
  { username: "elena_gialli", password: "passwordxyz", role: "user" }
];

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "Utente registrato!" });
});

// 2. LOGIN (Generazione Token)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if(!user || password != user.password){
        return res.status(401).json({ message: "Credenziali errate" });
    }

    // if (!user || !(await bcrypt.compare(password, user.password))) {
    //     return res.status(401).json({ message: "Credenziali errate" });
    // }

    // Genera il token valido per 1 ora
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});