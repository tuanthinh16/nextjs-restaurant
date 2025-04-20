'use client'
import { getSocket } from '@/utils/socket'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Unlock, MapPin, Users, ChevronRight, X } from 'lucide-react'
import Header from '../ui/Header'
import { useTranslation } from 'react-i18next'

type Table = {
    id: number
    table_number: string
    capacity: number
    status: 'locked' | 'available'
    location?: string
}

const TablePage = () => {
    const { t } = useTranslation('common');
    const [tables, setTables] = useState<Table[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        let socket: any

        const initSocket = async () => {
            try {
                socket = await getSocket()
                socket.emit('get_tables')

                socket.on('tables_data', (data: Table[]) => {
                    setTables(data.map(table => ({ ...table })))
                    setIsLoading(false)
                })

                socket.on('table_locked', ({ table_id }: { table_id: number }) => {
                    setTables(prev => prev.map(t =>
                        t.id === table_id ? { ...t, status: 'locked' } : t
                    ))
                })

                socket.on('table_unlocked', ({ table_id }: { table_id: number }) => {
                    setTables(prev => prev.map(t =>
                        t.id === table_id ? { ...t, status: 'available' } : t
                    ))
                    setSelectedTable(null)
                })

                socket.on('table_error', (data: { error: string }) => {
                    console.error('Lỗi:', data.error)
                    setIsLoading(false)
                })

            } catch (error) {
                console.error('Socket error:', error)
                setIsLoading(false)
            }
        }

        initSocket()

        return () => {
            if (socket) {
                socket.off('tables_data')
                socket.off('table_locked')
                socket.off('table_unlocked')
                socket.off('table_error')
                socket.disconnect()
            }
        }
    }, [])

    const handleClickTable = async (table: Table) => {
        const socket = await getSocket()
        if (table.status === 'available') {
            socket.emit('lock_table', { table_id: table.id })
            setSelectedTable(table)
        }
    }

    const handleUnlockTable = async () => {
        if (selectedTable) {
            const socket = await getSocket()
            socket.emit('unlock_table', { table_id: selectedTable.id })
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className='bg-gray-100 h-screen w-full'>
            <Header />
            <div className='h-17 w-full bg-gray-700'></div>
            <div className="p-4 max-w-7xl mx-auto pt-20">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('mapTitle')}</h1>
                    <p className="text-gray-600">{t('mapHint')}</p>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {tables.map(table => (
                        <div
                            key={table.id}
                            onClick={() => handleClickTable(table)}
                            className={`relative rounded-xl shadow-md transition-all duration-300 p-4 flex flex-col items-center justify-center h-32 cursor-pointer
                            ${table.status === 'locked'
                                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 cursor-not-allowed border border-gray-300'
                                    : 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-300 hover:shadow-lg'
                                }`}
                        >
                            {table.status === 'locked' ? (
                                <Lock className="h-5 w-5 text-gray-500 absolute top-2 right-2" />
                            ) : (
                                <Unlock className="h-5 w-5 text-green-500 absolute top-2 right-2" />
                            )}

                            <span className={`text-xl font-bold ${table.status === 'locked' ? 'text-gray-500' : 'text-green-700'}`}>
                                {t('tables')} {table.table_number}
                            </span>

                            <div className="flex items-center mt-2 text-sm">
                                <Users className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-gray-600">{table.capacity} {t('person')}</span>
                            </div>

                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{table.location}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Restaurant Layout */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-4 bg-gray-50 border-b flex items-center">
                        <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">{t('mapTitle')}</h2>
                    </div>
                    <div className="p-4">
                        <img
                            src="/restaurant-layout.jpg"
                            alt={t('mapTitle')}
                            className="w-full h-auto rounded-lg border border-gray-200"
                        // onError={(e) => {
                        //     (e.target as HTMLImageElement).src = '/restaurant-layout-placeholder.jpg'
                        // }}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            * {t('mapHint2')}
                        </p>
                    </div>
                </div>

                {/* Table Selection Modal */}
                {selectedTable && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-md animate-fade-in">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{t('tables')} {selectedTable.table_number}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{selectedTable.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>{t('cap')}: {selectedTable.capacity} {t('person')}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUnlockTable}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <p className="text-gray-600 mb-6">{t('ques-start')}</p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={handleUnlockTable}
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                    >
                                        <Unlock className="h-4 w-4 mr-2" />
                                        {t('button-unlock')}
                                    </button>
                                    <button
                                        onClick={() => router.push(`/order/table/${selectedTable.id}`)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center"
                                    >
                                        {t('button-continue')} <ChevronRight className="h-4 w-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TablePage