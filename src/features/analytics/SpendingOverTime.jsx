import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SpendingOverTime({ transactions }) {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const data = sortedTransactions.reduce((acc, transaction) => {
        const date = transaction.date;
        const existingEntry = acc.find(entry => entry.date === date);
        if (existingEntry) {
            existingEntry.amount += Number(transaction.amount);
        } else {
            acc.push({ date, amount: Number(transaction.amount) });
        }
        return acc;
    }, []);

    // Calculate cumulative sum
    let cumulativeSum = 0;
    data.forEach(entry => {
        cumulativeSum += entry.amount;
        entry.cumulativeAmount = cumulativeSum;
    });

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Spending Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulativeAmount" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SpendingOverTime;