import {useState, useMemo, useEffect} from 'react'
import TransactionList from './components/TransactionList'
import BalanceDisplay from './components/BalanceDisplay'
import SpendingChart from './components/SpendingChart'
import SpendingOverTime from './components/SpendingOverTime'
import ConfirmationModal from './components/ConfirmationModal'
import FilterControls from './components/FilterControls'
import SearchBar from './components/SearchBar'
import CategoryManager from './components/CategoryManager'
import BudgetManager from './components/BudgetManager'
import ExportImportManager from './components/ExportImportManager'
import Sidebar from './components/Sidebar'
import UserProfile from './components/UserProfile'
import {Bars3Icon} from '@heroicons/react/24/outline'
import GoalTracker from './components/GoalTracker'

function App() {
    const [transactions, setTransactions] = useState([])
    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        category: '',
        date: new Date().toISOString().substr(0, 10)
    })
    const [editingId, setEditingId] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState({isOpen: false, transactionId: null})
    const [filters, setFilters] = useState({startDate: '', endDate: '', category: ''})
    const [searchTerm, setSearchTerm] = useState('')
    const [categories, setCategories] = useState(['Food', 'Transport', 'Entertainment'])
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [budgets, setBudgets] = useState({})
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {name: 'Guest', avatar: null};
    })
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [goals, setGoals] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()
        const amount = parseFloat(newTransaction.amount)
        if (isNaN(amount) || newTransaction.category.trim() === '' || !newTransaction.date) return

        if (editingId) {
            setTransactions(transactions.map(t => t.id === editingId ? {...newTransaction, amount, id: editingId} : t))
            setEditingId(null)
        } else {
            setTransactions([...transactions, {...newTransaction, amount, id: Date.now()}])
        }

        setNewTransaction({amount: '', category: '', date: new Date().toISOString().substr(0, 10)})
    }

    const handleEdit = (transaction) => {
        setNewTransaction(transaction)
        setEditingId(transaction.id)
    }

    const handleDeleteConfirmation = (id) => {
        setDeleteConfirmation({isOpen: true, transactionId: id})
    }

    const handleDelete = () => {
        setTransactions(transactions.filter(t => t.id !== deleteConfirmation.transactionId))
        setDeleteConfirmation({isOpen: false, transactionId: null})
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const dateInRange = (!filters.startDate || tx.date >= filters.startDate) &&
                (!filters.endDate || tx.date <= filters.endDate);
            const categoryMatch = !filters.category || tx.category.toLowerCase().includes(filters.category.toLowerCase());
            const searchMatch = searchTerm === '' ||
                tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.amount.toString().includes(searchTerm);
            return dateInRange && categoryMatch && searchMatch;
        });
    }, [transactions, filters, searchTerm]);

    const handleAddCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory])
        }
    }

    const handleDeleteCategory = (categoryToDelete) => {
        setCategories(categories.filter(cat => cat !== categoryToDelete))
    }

    const handleInputChange = (e) => {
        setNewTransaction({...newTransaction, [e.target.name]: e.target.value})
    }

    const handleSetBudget = (category, amount) => {
        setBudgets(prev => ({...prev, [category]: amount}))
    }

    const getCategorySpending = (category) => {
        return filteredTransactions
            .filter(tx => tx.category === category)
            .reduce((sum, tx) => sum + Number(tx.amount), 0)
    }

    const handleExport = () => {
        const data = {
            transactions,
            categories,
            budgets
        }
        const jsonString = JSON.stringify(data)
        const blob = new Blob([jsonString], {type: 'application/json'})
        const href = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.download = "finance_tracker_data.json"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleImport = (importedData) => {
        try {
            const data = JSON.parse(importedData)
            setTransactions(data.transactions || [])
            setCategories(data.categories || [])
            setBudgets(data.budgets || {})
        } catch (error) {
            console.error("Error importing data:", error)
            alert("There was an error importing the data. Please check the file and try again.")
        }
    }

    const handleUpdateUser = (newUserData) => {
        setUser(prevUser => {
            const updatedUser = {...prevUser, ...newUserData};
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true)
            } else {
                setIsSidebarOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize() // Call once to set initial state
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const addGoal = (newGoal) => {
        setGoals(prevGoals => [...prevGoals, newGoal])
    }

    const updateGoal = (id, newAmount) => {
        setGoals(prevGoals => prevGoals.map(goal =>
            goal.id === id ? { ...goal, currentAmount: newAmount } : goal
        ))
    }

    const deleteGoal = (id) => {
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id))
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{activeTab}</h1>
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {activeTab === 'Dashboard' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <BalanceDisplay transactions={filteredTransactions}/>
                                        <form onSubmit={handleSubmit} className="mb-4">
                                            <input
                                                type="number"
                                                name="amount"
                                                value={newTransaction.amount}
                                                onChange={handleInputChange}
                                                placeholder="Amount"
                                                className="w-full mb-2 p-2 border rounded"
                                            />
                                            <select
                                                name="category"
                                                value={newTransaction.category}
                                                onChange={handleInputChange}
                                                className="w-full mb-2 p-2 border rounded"
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="date"
                                                name="date"
                                                value={newTransaction.date}
                                                onChange={handleInputChange}
                                                className="w-full mb-2 p-2 border rounded"
                                            />
                                            <button type="submit"
                                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                                                {editingId ? 'Update Transaction' : 'Add Transaction'}
                                            </button>
                                        </form>
                                    </div>
                                    <SpendingChart transactions={filteredTransactions} budgets={budgets}/>
                                </div>
                                <SpendingOverTime transactions={filteredTransactions}/>
                            </>
                        )}
                        {activeTab === 'Transactions' && (
                            <>
                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                                <FilterControls filters={filters} setFilters={setFilters} categories={categories}/>
                                <TransactionList
                                    transactions={filteredTransactions}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteConfirmation}
                                />
                            </>
                        )}
                        {activeTab === 'Budget' && (
                            <BudgetManager
                                categories={categories}
                                budgets={budgets}
                                onSetBudget={handleSetBudget}
                                getCategorySpending={getCategorySpending}
                            />
                        )}
                        {activeTab === 'Goals' && (
                            <GoalTracker
                                goals={goals}
                                addGoal={addGoal}
                                updateGoal={updateGoal}
                                deleteGoal={deleteGoal}
                            />
                        )}
                        {activeTab === 'Analytics' && (
                            <p>Analytics page coming soon!</p>
                        )}
                        {activeTab === 'Settings' && (
                            <>
                                <UserProfile user={user} onUpdateUser={handleUpdateUser} />
                                <CategoryManager
                                    categories={categories}
                                    onAddCategory={handleAddCategory}
                                    onDeleteCategory={handleDeleteCategory}
                                />
                                <ExportImportManager onExport={handleExport} onImport={handleImport} />
                            </>
                        )}
                    </div>
                </main>
            </div>
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, transactionId: null })}
                onConfirm={handleDelete}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
            />
        </div>
    )
}

export default App