import React from 'react'

function ExportImportManager({ onExport, onImport }) {
    const handleImport = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target.result
                onImport(content)
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Export/Import Data</h2>
            <div className="flex space-x-4">
                <button
                    onClick={onExport}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                    Export Data
                </button>
                <div>
                    <label htmlFor="import-file" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition cursor-pointer">
                        Import Data
                    </label>
                    <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    )
}

export default ExportImportManager