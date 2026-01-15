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
import { Button } from '../components/ui/Button';

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
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
            {/* Toolbar */}
            <header className="shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-arduino-teal/10 rounded-xl flex items-center justify-center border border-arduino-teal/20">
                            <Cpu className="w-6 h-6 text-arduino-teal" />
                        </div>
                        <h1 className="font-bold text-gray-900 text-lg hidden sm:block">Web IDE</h1>
                    </div>

                    <div className="h-8 w-px bg-gray-200" />

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleCompile}
                            disabled={isCompiling}
                            className="gap-2"
                            title="Verify / Compile"
                        >
                            {isCompiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            <span className="hidden sm:inline">Verify</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleUpload}
                            className="gap-2"
                            title="Upload"
                        >
                            <Download className="w-4 h-4 text-arduino-teal" />
                            <span className="hidden sm:inline">Upload</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <Usb className={`w-4 h-4 ml-2 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
                        <select
                            className="bg-transparent text-sm text-gray-600 focus:outline-none py-1 pr-2"
                            value={baudRate}
                            onChange={(e) => setBaudRate(Number(e.target.value))}
                            disabled={isConnected}
                        >
                            <option value="9600">9600 baud</option>
                            <option value="115200">115200 baud</option>
                        </select>
                    </div>

                    <Button
                        onClick={handleConnect}
                        className={isConnected ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 shadow-none" : "bg-arduino-teal hover:bg-teal-600 shadow-lg shadow-arduino-teal/20"}
                    >
                        {isConnected ? 'Disconnect' : 'Connect Device'}
                    </Button>
                </div>
            </header>

            {/* Main Content Split View */}
            <main className="flex-1 flex overflow-hidden">
                {/* Code Editor */}
                <div className="flex-1 bg-[#1e1e1e] flex flex-col border-r border-gray-800 relative group">
                    <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1e1e1e]">
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-arduino-teal" />
                            sketch.ino
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-arduino-teal/30"
                        spellCheck={false}
                    />
                </div>

                {/* Serial Monitor */}
                <div className="w-[400px] bg-[#0c0c0c] flex flex-col border-l border-gray-800 shadow-xl z-20">
                    <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#333]">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-300 font-medium">Serial Monitor</span>
                        </div>
                        <button
                            onClick={() => setSerialOutput(['> Cleared.'])}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Terminal Output */}
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {serialOutput.map((line, i) => (
                            <div key={i} className={`${line.includes('>>') ? 'text-cyan-400' :
                                line.includes('<<') ? 'text-green-400' :
                                    'text-gray-400'
                                }`}>
                                {line}
                            </div>
                        ))}
                        <div ref={outputEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="shrink-0 p-3 bg-[#1a1a1a] border-t border-[#333]">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={inputCmd}
                                onChange={(e) => setInputCmd(e.target.value)}
                                placeholder="Send command..."
                                className="flex-1 bg-[#0c0c0c] border border-[#333] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-arduino-teal focus:ring-1 focus:ring-arduino-teal font-mono placeholder:text-gray-700"
                                disabled={!isConnected}
                            />
                            <button
                                type="submit"
                                disabled={!isConnected}
                                className="p-2 bg-[#333] hover:bg-[#444] text-gray-400 hover:text-white rounded-md disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="flex gap-3 mt-3 text-[10px] text-gray-600 justify-end font-mono">
                            <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                {isConnected ? 'ONLINE' : 'OFFLINE'}
                            </span>
                            <span>{baudRate} BAUD</span>
                            <span>NO LINE ENDING</span>
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
