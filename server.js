import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const CSV_FILE = path.join(__dirname, 'confirmacoes.csv');

app.use(cors());
app.use(bodyParser.json());

// Função para verificar se um nome já foi confirmado
const checkDuplicate = (name) => {
    if (!fs.existsSync(CSV_FILE)) return false;
    const data = fs.readFileSync(CSV_FILE, 'utf8');
    return data.split('\n').some(line => line.split(',')[0].toLowerCase() === name.toLowerCase());
};

// Rota para processar confirmações
app.post('/confirmar', (req, res) => {
    const { name, guests } = req.body;
    if (!name || !guests) {
        return res.status(400).json({ message: 'Nome e número de convidados são obrigatórios.' });
    }

    if (checkDuplicate(name)) {
        return res.status(409).json({ message: 'Já temos a tua confirmação!' });
    }

    const entry = `${name},${guests}\n`;
    fs.appendFileSync(CSV_FILE, entry);
    res.json({ message: 'Confirmação recebida com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});
