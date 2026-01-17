import { useEffect, useRef, useState } from 'react';

// Define mermaid types
declare global {
    interface Window {
        mermaid: any;
    }
}

export default function MermaidDiagram({ code }: { code: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                // Dynamic import from CDN if not present
                if (!window.mermaid) {
                    // @ts-ignore
                    await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
                    window.mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default',
                        securityLevel: 'loose',
                    });
                }

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await window.mermaid.render(id, code);

                if (isMounted) {
                    setSvg(svg);
                    setError(null);
                }
            } catch (err) {
                console.error("Mermaid error:", err);
                if (isMounted) {
                    // Fallback to simpler error message or raw code
                    setError('Diagram syntax error');
                }
            }
        };

        renderDiagram();

        return () => {
            isMounted = false;
        };
    }, [code]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-mono">
                <p className="font-bold mb-1">Diagram Error:</p>
                {error}
                <pre className="mt-2 p-2 bg-white rounded border border-red-100 overflow-auto text-[10px]">{code}</pre>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="mermaid-wrapper my-6 flex justify-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
