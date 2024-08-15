function TransactionList({ transactions, onEdit, onDelete }) {
    return (
        <ul className="bg-white shadow-md rounded-lg overflow-hidden">
            {transactions.map(tx => (
                <li key={tx.id} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                    <div>
                        <span className="font-medium">{tx.category}</span>
                        <span className="text-sm text-gray-500 ml-2">{tx.date}</span>
                    </div>
                    <div className="flex items-center">
                    <span className={`font-semibold mr-4 ${Number(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Number(tx.amount).toFixed(2)}
                    </span>
                        <button
                            onClick={() => onEdit(tx)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(tx.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default TransactionList