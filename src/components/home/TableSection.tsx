'use client'
import { useState } from 'react'

const tables = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Bàn ${i + 1}`,
    isBooked: false,
}))

const TablePage = () => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null)

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Sơ đồ bàn</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => setSelectedTable(table.id)}
                        className={`h-24 rounded-lg shadow flex items-center justify-center font-semibold
              ${table.isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        disabled={table.isBooked}
                    >
                        {table.name}
                    </button>
                ))}
            </div>

            {selectedTable && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 space-y-4">
                        <h3 className="text-lg font-bold">Đặt bàn {selectedTable}</h3>
                        <p>Bạn muốn chọn món cho bàn này?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedTable(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: chuyển sang trang chọn món
                                    window.location.href = `/order?table=${selectedTable}`
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Chọn món
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablePage
