'use client'
import { useEffect, useState } from 'react'
import { deleteAPI, get, post, put } from '@/utils/api'
import Loading from '@/components/ui/Loadding'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Dialog } from '@/components/ui/Dialog';
import { DialogTableForm } from '@/components/ui/DialogTableForm';
type Table = {
    id: number
    table_number: string
    capacity: number
}


export default function TablePage() {
    const [tables, setTables] = useState<Table[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const [newTable, setNewTable] = useState({ table_number: '', capacity: 4 })
    useEffect(() => {
        fetchTables()
    }, [])

    const fetchTables = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await get<Table[]>('/api/tables')
            if (res.success) {
                setTables(res.data as Table[])
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách bàn.')
        } finally {
            setLoading(false)
        }
    }

    const handleAddTable = async (data: { table_number: string; capacity: number }) => {
        try {
            setLoading(true)
            await post('/api/tables', data)
            fetchTables()
            setOpenDialog(false)
        } catch {
            setError('Lỗi khi thêm bàn.')
        } finally {
            setLoading(false)
        }
    }

    const updateTable = async (id: number) => {
        try {
            setLoading(true)
            await put(`/api/tables/${id}`, { name: 'Đã sửa', capacity: 6 })
            fetchTables()
        } catch {
            setError('Lỗi khi cập nhật bàn.')
        } finally {
            setLoading(false)
        }
    }

    const deleteTable = async (id: number) => {
        try {
            setLoading(true)
            await deleteAPI(`/api/tables/${id}`, {})
            fetchTables()
        } catch {
            setError('Lỗi khi xóa bàn.')
        } finally {
            setLoading(false)
        }
    }
    if (loading) <Loading />
    if (!tables) return <div className='pt-20 m-auto'>No data found</div>
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Quản lý bàn</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}


            <button onClick={() => setOpenDialog(true)} className="mb-4 bg-cyan-700 text-white px-4 py-2 rounded">
                Thêm bàn
            </button>

            <ul>
                {tables.map((table) => (
                    <li key={table.id} className="mb-2 flex justify-between items-center bg-white p-2 shadow rounded">
                        <span>Bàn số {table.table_number} - {table.capacity} chỗ</span>
                        <div className="space-x-2">
                            <button onClick={() => updateTable(table.id)} className="text-blue-600 cursor-pointer" disabled={loading} title='Edit' >
                                <CiEdit />
                            </button>
                            <button onClick={() => deleteTable(table.id)} className="text-red-600 cursor-pointer" disabled={loading} title='Delete'>
                                <MdDelete />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {openDialog && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTableForm onSubmit={handleAddTable} onClose={() => setOpenDialog(false)} />
                </Dialog>
            )}

        </div>
    )
}
