import express from 'express';
const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/transactions', (req, res) => {
    // Placeholder data, you'd fetch real data here
    res.json([{ id: 1, amount: 50, category: 'Food' }]);
});

app.listen(port, () => {
    console.log(`Server's vibing on port ${port}`);
});