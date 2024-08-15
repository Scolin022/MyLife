function BalanceDisplay({ transactions }) {
    const totalBalance = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
            <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalBalance.toFixed(2)}
            </p>
        </div>
    );
}

export default BalanceDisplay;