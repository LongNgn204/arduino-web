import { useState, useEffect, useRef } from 'react';
import {
    Cpu,
    Usb,
    Terminal,
    Trash2,
    Send,
    Download,
    CheckCircle2,
    Loader2
} from 'lucide-react';

export default function WebIdePage() {
    // Editor State
    const [code, setCode] = useState('// Arduino Loopback Test\n\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println("Hello from Arduino Web IDE!");\n}\n\nvoid loop() {\n  if (Serial.available()) {\n    String data = Serial.readString();\n    Serial.print("Echo: ");\n    Serial.println(data);\n  }\n  delay(100);\n}');
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileStatus, setCompileStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Serial State
    const [port, setPort] = useState<SerialPort | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [serialOutput, setSerialOutput] = useState<string[]>(['> Ready to connect...']);
    const [baudRate, setBaudRate] = useState(9600);
    const [inputCmd, setInputCmd] = useState('');
    const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
    const writerRef = useRef<WritableStreamDefaultWriter | null>(null);
    const outputEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll serial output
    useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [serialOutput]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (port && port.readable && !port.readable.locked) {
                port.close();
            }
        };
    }, [port]);

    const addToLog = (msg: string, type: 'info' | 'rx' | 'tx' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'tx' ? '<< ' : type === 'rx' ? '>> ' : '> ';
        setSerialOutput(prev => [...prev.slice(-99), `[${timestamp}] ${prefix}${msg}`]);
    };

    const handleConnect = async () => {
        if (!('serial' in navigator)) {
            alert('Trình duyệt của bạn không hỗ trợ Web Serial API. Vui lòng dùng Chrome hoặc Edge.');
            return;
        }

        if (isConnected && port) {
            // Disconnect logic
            try {
                if (readerRef.current) await readerRef.current.cancel();
                if (writerRef.current) await writerRef.current.close();
                await port.close();
                setIsConnected(false);
                setPort(null);
                addToLog('Disconnected', 'info');
            } catch (e) {
                console.error(e);
                addToLog('Error disconnecting', 'info');
            }
            return;
        }

        try {
            const p = await navigator.serial.requestPort();
            await p.open({ baudRate });
            setPort(p);
            setIsConnected(true);
            addToLog(`Connected to device (${baudRate} baud)`, 'info');

            // Start reading loop
            readLoop(p);
        } catch (e) {
            console.error(e);
            addToLog('Failed to connect: ' + e, 'info');
        }
    };

    const readLoop = async (p: SerialPort) => {
        if (!p.readable) return;
        const textDecoder = new TextDecoderStream();
        p.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) matchAndLog(value);
            }
        } catch (e) {
            console.error(e);
        } finally {
            reader.releaseLock();
        }
    };

    // Buffer for handling split chunks
    const bufferRef = useRef('');

    const matchAndLog = (chunk: string) => {
        bufferRef.current += chunk;
        // Split by newlines
        const lines = bufferRef.current.split('\n');
        // If the last character wasn't a newline, keep the last fragment in buffer
        if (!chunk.endsWith('\n')) {
            bufferRef.current = lines.pop() || '';
        } else {
            bufferRef.current = '';
        }

        lines.forEach(line => {
            if (line.trim()) addToLog(line.trim(), 'rx');
        });
    };

    const handleSend = async () => {
        if (!port || !port.writable || !inputCmd) return;

        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(port.writable);
        const writer = textEncoder.writable.getWriter();
        writerRef.current = writer;

        await writer.write(inputCmd + '\n');
        addToLog(inputCmd, 'tx');
        setInputCmd('');

        writer.releaseLock();
    };

    const handleCompile = () => {
        setIsCompiling(true);
        setCompileStatus('idle');
        addToLog('Compiling sketch...', 'info');

        // Mock Compile Process
        setTimeout(() => {
            setIsCompiling(false);
            setCompileStatus('success');
            addToLog('Compilation successful! (Mock)', 'info');
            addToLog('Sketch uses 924 bytes (2%) of program storage space.', 'info');
        }, 2000);
    };

    const handleUpload = () => {
        if (compileStatus !== 'success') {
            alert('Vui lòng biên dịch (verify) code trước khi nạp!');
            return;
        }
        if (!isConnected) {
            alert('Vui lòng kết nối thiết bị trước!');
            handleConnect();
            return;
        }

        // Mock Upload
        addToLog('Starting upload...', 'info');
        setTimeout(() => addToLog('Reading | #################### | 100% 0.15s', 'info'), 500);
        setTimeout(() => addToLog('Writing | #################### | 100% 0.22s', 'info'), 1000);
        setTimeout(() => addToLog('avrdude: 924 bytes of flash written', 'info'), 1500);
        setTimeout(() => addToLog('Upload complete!', 'info'), 1600);
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <header className="shrink-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center border border-teal-500/20">
                            <Cpu className="w-5 h-5 text-teal-400" />
                        </div>
                        <h1 className="font-bold text-white text-sm hidden sm:block">Web IDE</h1>
                    </div>

                    <div className="h-6 w-px bg-slate-800 mx-2" />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCompile}
                            disabled={isCompiling}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm border border-slate-700"
                            title="Verify / Compile"
                        >
                            {isCompiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                            <span className="hidden sm:inline">Verify</span>
                        </button>
                        <button
                            onClick={handleUpload}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm border border-slate-700"
                            title="Upload"
                        >
                            <Download className="w-4 h-4 text-cyan-400" />
                            <span className="hidden sm:inline">Upload</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <Usb className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-slate-500'}`} />
                        <select
                            className="bg-transparent text-xs text-slate-300 focus:outline-none"
                            value={baudRate}
                            onChange={(e) => setBaudRate(Number(e.target.value))}
                            disabled={isConnected}
                        >
                            <option value="9600">9600 baud</option>
                            <option value="115200">115200 baud</option>
                        </select>
                    </div>

                    <button
                        onClick={handleConnect}
                        className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${isConnected
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/20'
                            }
                        `}
                    >
                        {isConnected ? 'Disconnect' : 'Connect Device'}
                    </button>
                </div>
            </header>

            {/* Main Content Split View */}
            <main className="flex-1 flex overflow-hidden">
                {/* Code Editor */}
                <div className="flex-1 bg-[#1e1e1e] flex flex-col border-r border-slate-800">
                    <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">sketch.ino</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                        spellCheck={false}
                    />
                </div>

                {/* Serial Monitor */}
                <div className="w-[400px] bg-[#0c0c0c] flex flex-col border-l border-slate-800">
                    <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 h-[37px]">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400 font-medium">Serial Monitor</span>
                        </div>
                        <button
                            onClick={() => setSerialOutput(['> Cleared.'])}
                            className="text-slate-500 hover:text-slate-300"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Terminal Output */}
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
                        {serialOutput.map((line, i) => (
                            <div key={i} className={`${line.includes('>>') ? 'text-cyan-400' :
                                line.includes('<<') ? 'text-green-400' :
                                    'text-slate-500'
                                }`}>
                                {line}
                            </div>
                        ))}
                        <div ref={outputEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="shrink-0 p-3 bg-slate-900 border-t border-slate-800">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={inputCmd}
                                onChange={(e) => setInputCmd(e.target.value)}
                                placeholder="Send command..."
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                                disabled={!isConnected}
                            />
                            <button
                                type="submit"
                                disabled={!isConnected}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="flex gap-2 mt-2 text-[10px] text-slate-500 justify-end">
                            <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                {isConnected ? 'Online' : 'Offline'}
                            </span>
                            <span>{baudRate} baud</span>
                            <span>No Line Ending</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Add these types to global or local context to avoid TS errors with navigator.serial
// In a real project these would go in a d.ts file
interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream;
    writable: WritableStream;
}

declare global {
    interface Navigator {
        serial: {
            requestPort(): Promise<SerialPort>;
        };
    }
}
