import http from 'node:http';
import express from 'express';

const app = express();
app.use(express.json());

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Credenziali errate" });
    }

    // Genera il token valido per 1 ora
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});



// http.createServer(function (req, res) {
//     const headers = {
//         'Access-Control-Allow-Origin': '*', 
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//         'Content-Type': 'application/json'
//     };

//     // if (req.method === 'OPTIONS') {
//     //     res.writeHead(204, headers);
//     //     res.end();
//     //     return;
//     // }

//     res.writeHead(200, headers);
//     res.end('Hello World 2!');
// }).listen(8080);