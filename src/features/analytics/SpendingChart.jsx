import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function SpendingChart({ transactions, budgets }) {
    const categoryTotals = transactions.reduce((acc, transaction) => {
        const amount = Math.abs(Number(transaction.amount));
        acc[transaction.category] = (acc[transaction.category] || 0) + amount;
        return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([category, total]) => ({
        name: category,
        value: total,
        budget: budgets[category] || 0
    }));

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, budget }) => `${name} ${(value / budget * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`$${value.toFixed(2)} / $${props.payload.budget.toFixed(2)}`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SpendingChart;