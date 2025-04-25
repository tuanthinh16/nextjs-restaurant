'use client'
import { useEffect, useRef, useState } from 'react';

type Bet = {
    eid: string;
    v: number;
    uC: number;
};
type ResultBet = {
    resultRaw: string;
    status: string;
    jackpotResultRaw: string;
}
const betGroups = [
    {
        title: 'TÀI / XỈU / CHẴN / LẺ',
        items: ['BIG', 'SMALL', 'EVEN', 'ODD'],
        color: 'bg-red-50',
        special: true
    },
    {
        title: 'MẶT XÚC XẮC',
        items: ['DICE_1', 'DICE_2', 'DICE_3', 'DICE_4', 'DICE_5', 'DICE_6'],
        color: 'bg-blue-50'
    },
    {
        title: 'BỘ BA / BỘ ĐÔI',
        items: [
            'TRIPLE_1', 'TRIPLE_2', 'TRIPLE_3', 'TRIPLE_4', 'TRIPLE_5', 'TRIPLE_6', 'DICE_TRIPLE',
            'PAIR_1_1', 'PAIR_2_2', 'PAIR_3_3', 'PAIR_4_4', 'PAIR_5_5', 'PAIR_6_6'
        ],
        color: 'bg-purple-50'
    },

    {
        title: 'CẶP SỐ',
        items: [
            'PAIR_1_2', 'PAIR_1_3', 'PAIR_1_4', 'PAIR_1_5', 'PAIR_1_6',
            'PAIR_2_3', 'PAIR_2_4', 'PAIR_2_5', 'PAIR_2_6',
            'PAIR_3_4', 'PAIR_3_5', 'PAIR_3_6',
            'PAIR_4_5', 'PAIR_4_6', 'PAIR_5_6'
        ],
        color: 'bg-yellow-50'
    },
    {
        title: 'SỐ ĐƠN',
        items: Array.from({ length: 18 }, (_, i) => `NUMBER_${i + 1}`),
        color: 'bg-green-50'
    }
];

const default1 = [1,"Livestream","SC_thinhpro377","Concac11",{"info":"{\"ipAddress\":\"125.235.239.77\",\"userId\":\"5d7ff13d-f579-4b11-8297-e9f92f5c0fdc\",\"username\":\"SC_thinhpro377\",\"timestamp\":1745483896457,\"refreshToken\":\"faa07306332b4e2d8c950ac2acfdccff.204f4709f1f744f9b73568a509daa308\"}","signature":"38C91CA872D09BC984F6DEC12E32D6262552B7B798B7125D16CBCFC4DE944D836C8C41289040C3441C062031E63C900F63C74523DB5C4BEEDE4F16126FD527022C03147D268D7589BFA50414990A92DCD2C02144C15DE098AE2E8C82E3801EB8D9B96DF616534848205BD00851EEBE15CD3C94ED4E33B0F465C6237F49F3F58C","pid":4,"subi":true}]
const default2 = [6, "Livestream", "Sicbo88Plugin", { "cmd": 1950, "sC": true }]
const default3 = [6, "Livestream", "Sicbo88Plugin", { "cmd": 1959 }]
const default4 = [7, "Livestream", 2, 0]

export default function WebSocketTest() {
    const [message, setMessage] = useState('');
    const [log, setLog] = useState<string[]>([]);
    const [bets, setBets] = useState<Bet[]>([]);
    const prevBets = useRef<Bet[]>([]);
    const [result, setResult] = useState<ResultBet | null>(null);
    const [isEnd, setIsEnd] = useState(false);
    const [diceResult, setDiceResult] = useState<number[]>([]);
    const [start, setStart] = useState(false);
    const [bound, setBound] = useState('');
    const [preBound, setPrebound] = useState('');
    const ws = useRef<WebSocket | null>(null);

    const hasBetChanged = (eid: string, currentValue: number) => {
        const prevBet = prevBets.current.find(b => b.eid === eid);
        return prevBet ? prevBet.v !== currentValue : false;
    };
    useEffect(() => {
        let counter = 2;
        ws.current = new WebSocket('wss://livecasino.azhkthg1.com/websocket');

        ws.current.onopen = () => {
            setLog(prev => [...prev, '✅ Connected']);
            ws.current?.send(JSON.stringify(default1));


        };

        ws.current.onmessage = (e) => {
            try {
                const parsed = JSON.parse(e.data);
                if (Array.isArray(parsed) && parsed[1]?.Js) return;

                setLog(prev => [...prev, `📨 ${e.data}`]);

                if (parsed[1]?.bs) {
                    setBets(parsed[1].bs);
                }
                if (parsed[1]?.resultRaw) {
                    if (parsed[1].status === 'ENDED') {
                        setResult(parsed[1]);
                        setIsEnd(true);
                        // Extract dice results from resultRaw (assuming format like "1,2,3")
                        const dice = parsed[1].resultRaw.split(',').map(Number);
                        setDiceResult(dice);
                        const boundInfo = parsed[1]['lastBonusInfo']['entryBonus'];
                        if (preBound && bound && bound != preBound) {

                        }
                        setBound(boundInfo);
                        setPrebound(boundInfo);
                        console.log(parsed[1])
                        // Reset bets after a delay to show results
                        setTimeout(() => {
                            setBets([]);
                            setIsEnd(false);
                            setResult(null);
                        }, 20000); // 10 seconds delay
                    }
                }
            } catch (err) {
                console.error('Invalid JSON:', err);
            }
        };

        ws.current.onerror = () => setLog(prev => [...prev, '❌ Error']);
        ws.current.onclose = () => setLog(prev => [...prev, '🔌 Disconnected']);

        return () => ws.current?.close();
    }, []);
    const getDiceColor = (num: number) => {
        const colors = [
            'bg-red-500 hover:bg-red-600 transition-colors',
            'bg-blue-500 hover:bg-blue-600 transition-colors',
            'bg-green-500 hover:bg-green-600 transition-colors',
            'bg-yellow-500 hover:bg-yellow-600 transition-colors',
            'bg-purple-500 hover:bg-purple-600 transition-colors',
            'bg-pink-500 hover:bg-pink-600 transition-colors'
        ];
        return colors[num - 1] || 'bg-gray-500 hover:bg-gray-600 transition-colors';
    };
    const onStart = () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(default2));
            setLog(prev => [...prev, `➡️ Sent default2 (start betting)`]);

            setTimeout(() => {
                ws.current?.send(JSON.stringify(default3));
                setLog(prev => [...prev, `➡️ Sent default3 (join/confirm)`]);
            }, 2000); // đợi 2s
            setStart(true);
        } else {
            setLog(prev => [...prev, '⚠️ WebSocket not open']);
        }
    };


    const sendMessage = () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(message);
            setLog(prev => [...prev, `➡️ ${message}`]);
            setMessage('');
        } else {
            setLog(prev => [...prev, '⚠️ WebSocket not open']);
        }
    };

    const logRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [log]);
    useEffect(() => {
        // Update previous bets reference when bets change
        prevBets.current = bets;
    }, [bets]);
    useEffect(() => {
        let counter = 2;
        const interval = setInterval(() => {
            const msg = [7, "Livestream", counter, 0];
            if (!start) return;
            ws.current?.send(JSON.stringify(msg));
            counter++;
        }, 2000);

        return () => clearInterval(interval);
    }, [start]);

    const formatDisplayName = (eid: string) => {
        if (eid === 'BIG') return 'Tài';
        if (eid === 'SMALL') return 'Xỉu';
        if (eid === 'EVEN') return 'Chẵn';
        if (eid === 'ODD') return 'Lẻ';

        if (eid.startsWith('DICE_')) {
            const num = eid.split('_')[1];
            return `Mặt ${num}`;
        }

        if (eid.startsWith('NUMBER_')) {
            const num = eid.split('_')[1];
            return `Số ${num}`;
        }

        if (eid.startsWith('PAIR_')) {
            const parts = eid.split('_');
            if (parts[1] === parts[2]) {
                return `2 mặt ${parts[1]}`;
            }
            return `Mặt ${parts[1]} & ${parts[2]}`;
        }

        if (eid.startsWith('TRIPLE_')) {
            const num = eid.split('_')[1];
            return `3 mặt ${num}`;
        }

        if (eid === 'DICE_TRIPLE') {
            return 'Bộ ba bất kỳ';
        }

        return eid.replace(/_/g, ' ');
    };

    // Function to render dice faces for display names
    const renderDiceFaces = (eid: string) => {
        if (eid === 'BIG') return 'Tài';
        if (eid === 'SMALL') return 'Xỉu';
        if (eid === 'EVEN') return 'Chẵn';
        if (eid === 'ODD') return 'Lẻ';

        if (eid.startsWith('DICE_')) {
            const num = parseInt(eid.split('_')[1]);
            return (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getDiceColor(num)} mx-auto`}>
                    {num}
                </div>
            );
        }

        if (eid.startsWith('PAIR_')) {
            const parts = eid.split('_');
            const num1 = parseInt(parts[1]);
            const num2 = parseInt(parts[2]);
            return (
                <div className="flex justify-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getDiceColor(num1)}`}>
                        {num1}
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getDiceColor(num2)}`}>
                        {num2}
                    </div>
                </div>
            );
        }

        if (eid.startsWith('TRIPLE_')) {
            const num = parseInt(eid.split('_')[1]);
            return (
                <div className="flex justify-center gap-1">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getDiceColor(num)}`}>
                            {num}
                        </div>
                    ))}
                </div>
            );
        }

        if (eid === 'DICE_TRIPLE') {
            return 'Bộ ba bất kỳ';
        }

        if (eid.startsWith('NUMBER_')) {
            const num = eid.split('_')[1];
            return `Số ${num}`;
        }

        return eid.replace(/_/g, ' ');
    };


    return (
        <div className="p-4 w-full mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Sicbo Live Betting Dashboard</h1>

            {/* Connection Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        className="border border-gray-300 px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter WebSocket message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                        <button
                            onClick={onStart}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Start Round
                        </button>
                    </div>
                </div>

                {/* Results Display */}
                {result && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white animate-fade-in">
                        <h2 className="text-xl font-bold mb-2 animate-bounce">🎲 Kết quả xổ số</h2>
                        <div className="flex justify-center gap-4 mb-2">
                            {diceResult.map((num, idx) => (
                                <div
                                    key={idx}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${getDiceColor(num)} shadow-lg transform hover:scale-110 transition-transform`}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div className="text-center animate-pulse">
                            <p>Tổng: {diceResult.reduce((a, b) => a + b, 0)} - {diceResult.reduce((a, b) => a + b, 0) > 10 ? 'Tài' : 'Xỉu'}</p>
                            <p>Chẵn/Lẻ: {diceResult.reduce((a, b) => a + b, 0) % 2 === 0 ? 'Chẵn' : 'Lẻ'}</p>
                            <p>Nhân: {bound}</p>
                        </div>
                    </div>
                )}


            </div>

            {/* Betting Board */}
            <div className="grid grid-cols-1 gap-4">
                {/* Special row for Tài/Xỉu/Chẵn/Lẻ */}
                <div className="grid grid-cols-4 gap-4">
                    {betGroups[0].items.map(eid => {
                        const bet = bets.find(b => b.eid === eid);
                        const changed = hasBetChanged(eid, bet?.v || 0);
                        const value = bet?.v ? `${(bet.v / 1000).toFixed(1)}k` : '0';

                        return (
                            <div
                                key={eid}
                                className={`border rounded-lg p-3 text-center transition-all duration-300 ${bet?.v ? 'bg-white shadow-md' : 'bg-gray-50'
                                    } ${changed ? 'animate-flash border-yellow-400' : ''
                                    } hover:shadow-lg hover:border-blue-300`}
                            >
                                <div className="font-bold text-lg mb-1">
                                    {formatDisplayName(eid)}
                                </div>
                                <div className={`text-xl font-bold transition-all duration-300 ${changed ? 'text-green-600 scale-110' : 'text-blue-600'
                                    }`}>
                                    {value}₫
                                </div>
                                <div className="text-sm text-gray-500 transition-all duration-300">
                                    {bet?.uC || 0} người
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Regular betting groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {betGroups.slice(1).map((group, idx) => (
                        <div key={idx} className={`border rounded-lg overflow-hidden shadow-md ${group.color} transition-all hover:shadow-lg`}>
                            <div className="bg-gray-800 text-white p-2 font-bold text-center hover:bg-gray-700 transition-colors">
                                {group.title}
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-2">
                                {group.items.map(eid => {
                                    const bet = bets.find(b => b.eid === eid);
                                    const changed = hasBetChanged(eid, bet?.v || 0);
                                    const value = bet?.v ? `${(bet.v / 1000).toFixed(1)}k` : '0';

                                    return (
                                        <div
                                            key={eid}
                                            className={`border rounded p-2 text-center transition-all duration-300 ${bet?.v ? 'bg-white shadow-md' : 'bg-gray-50'
                                                } ${changed ? 'animate-flash border-yellow-400' : ''
                                                } hover:shadow-lg hover:border-blue-300`}
                                        >
                                            <div className="font-medium text-sm text-gray-800 mb-1">
                                                {renderDiceFaces(eid)}
                                            </div>
                                            <div className={`text-lg font-bold transition-all duration-300 ${changed ? 'text-green-600 scale-110' : 'text-blue-600'
                                                }`}>
                                                {value}₫
                                            </div>
                                            <div className="text-xs text-gray-500 transition-all duration-300">
                                                {bet?.uC || 0} người
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Log Display */}
            <div className="bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto text-sm" ref={logRef}>
                {log.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`font-mono py-1 px-2 rounded ${msg.includes('✅') ? 'text-green-400' : msg.includes('❌') ? 'text-red-400' : msg.includes('📨') ? 'text-blue-400' : 'text-gray-300'}`}
                    >
                        {msg}
                    </div>
                ))}
            </div>
            {/* Status Bar */}
            <div className="mt-6 p-2 bg-gray-100 rounded-lg text-center text-sm transition-colors hover:bg-gray-200">
                {ws.current?.readyState === WebSocket.OPEN ? (
                    <span className="text-green-600 animate-pulse">🟢 Đang kết nối</span>
                ) : (
                    <span className="text-red-600">🔴 Mất kết nối</span>
                )}
                {isEnd && (
                    <span className="ml-4 text-red-600 animate-pulse">⏳ Đang chờ kết quả...</span>
                )}
            </div>
            {/* Add these animations to your global CSS */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes flash {
                    0% { background-color: inherit; }
                    50% { background-color: rgba(255, 255, 0, 0.3); }
                    100% { background-color: inherit; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in;
                }
                .animate-flash {
                    animation: flash 0.5s 2;
                }
            `}</style>
        </div>
    );
}