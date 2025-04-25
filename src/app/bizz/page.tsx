'use client'
import { useState, useEffect, useRef } from 'react';

interface CandleData {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    candleClose: number;
    type: string;
}

interface WssMessage {
    type: string;
    data: CandleData;
}

export default function BizzanLiveCandle() {
    const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
    const [candleHistory, setCandleHistory] = useState<CandleData[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        setConnectionStatus('connecting');
        setError(null);

        const ws = new WebSocket('wss://bizzan.live:2096/');
        wsRef.current = ws;

        ws.onopen = () => {
            setConnectionStatus('connected');
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const message: WssMessage = JSON.parse(event.data);
                if (message.type === 'allData') {
                    updateCandleData(message.data);
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };

        ws.onerror = (error) => {
            setError('WebSocket error occurred');
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            if (connectionStatus !== 'disconnected') {
                setConnectionStatus('disconnected');
                console.log('WebSocket disconnected');
                // Attempt to reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            }
        };
    };

    const updateCandleData = (newData: CandleData) => {
        setCurrentCandle(prev => {
            if (!prev || prev.date !== newData.date) {
                // New candle, add to history
                if (prev) {
                    setCandleHistory(prevHistory => [prev, ...prevHistory].slice(0, 50));
                }
                return newData;
            }

            // Update existing candle
            return {
                ...newData,
                high: Math.max(prev.high, newData.high),
                low: Math.min(prev.low, newData.low),
            };
        });
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const getPriceChange = (open: number, close: number) => {
        return ((close - open) / open * 100).toFixed(2);
    };

    const getStatusColor = () => {
        if (!currentCandle) return 'bg-gray-500';
        return currentCandle.close >= currentCandle.open ? 'bg-green-500' : 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Bizzan Live Candle Data</h1>

                <div className="mb-4 flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-white ${connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                        {connectionStatus.toUpperCase()}
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                </div>

                {currentCandle ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Current Candle Card */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-lg font-semibold mb-2">Current Candle</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span>{formatTime(currentCandle.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded ${getStatusColor()}`}>
                                        {currentCandle.type} ({currentCandle.candleClose}s)
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Open:</span>
                                    <span>{currentCandle.open.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">High:</span>
                                    <span className="text-green-600">{currentCandle.high.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Low:</span>
                                    <span className="text-red-600">{currentCandle.low.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Close:</span>
                                    <span className={currentCandle.close >= currentCandle.open ? 'text-green-600' : 'text-red-600'}>
                                        {currentCandle.close.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Change:</span>
                                    <span className={currentCandle.close >= currentCandle.open ? 'text-green-600' : 'text-red-600'}>
                                        {getPriceChange(currentCandle.open, currentCandle.close)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Volume:</span>
                                    <span>{currentCandle.volume.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Candle Visualization */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-lg font-semibold mb-2">Candle Visualization</h2>
                            <div className="h-64 flex items-end justify-center">
                                <div className="w-16 flex flex-col items-center">
                                    <div
                                        className={`w-8 ${currentCandle.close >= currentCandle.open ? 'bg-green-200' : 'bg-red-200'}`}
                                        style={{
                                            height: `${Math.abs(currentCandle.high - currentCandle.low) / currentCandle.high * 100}%`,
                                            minHeight: '1px'
                                        }}
                                    >
                                        <div
                                            className={`w-8 ${currentCandle.close >= currentCandle.open ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{
                                                height: `${Math.abs(currentCandle.close - currentCandle.open) / currentCandle.high * 100}%`,
                                                minHeight: '1px'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-lg font-semibold mb-2">Recent Candles</h2>
                            <div className="overflow-y-auto max-h-64">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Time</th>
                                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Open</th>
                                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Close</th>
                                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {candleHistory.map((candle, index) => (
                                            <tr key={index}>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                                    {formatTime(candle.date)}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                                    {candle.open.toFixed(2)}
                                                </td>
                                                <td className={`px-2 py-1 whitespace-nowrap text-sm ${candle.close >= candle.open ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {candle.close.toFixed(2)}
                                                </td>
                                                <td className={`px-2 py-1 whitespace-nowrap text-sm ${candle.close >= candle.open ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {getPriceChange(candle.open, candle.close)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500">Waiting for candle data...</p>
                    </div>
                )}
            </div>
        </div>
    );
}