import { useEffect, useState } from 'react';
import { Lock, Download, Award, ShieldCheck, Home, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const API_BASE = import.meta.env.PROD
    ? 'https://arduino-workers.stu725114073.workers.dev'
    : '';

interface CertificateData {
    id: string;
    studentName: string;
    courseName: string;
    issueDate: string;
    instructor: string;
}

export function CertificatePage() {
    const [eligible, setEligible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [certData, setCertData] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/api/certificate`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setEligible(data.eligible);
                setProgress(data.progress || 0);
                if (data.certificate) {
                    setCertData(data.certificate);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center font-sans">
            <div className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Checking eligibility...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-8 flex flex-col items-center font-sans">
            {/* Header / Nav */}
            <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground gap-2">
                    <Home className="w-4 h-4" /> Dashboard
                </Button>
                <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    Chứng Nhận
                </div>
            </div>

            {!eligible ? (
                // LOCKED STATE
                <div className="max-w-md w-full bg-card rounded-lg p-8 border border-border text-center shadow-lg">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                        <Lock className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Chưa đủ điều kiện nhận bằng</h2>
                    <p className="text-muted-foreground mb-6">
                        Bạn cần hoàn thành ít nhất 80% khóa học. Tiến độ hiện tại của bạn:
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-4 mb-2 overflow-hidden">
                        <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-right text-sm text-amber-600 font-bold mb-8">
                        {progress}% / 80%
                    </div>

                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-6 text-lg"
                    >
                        Tiếp tục học
                    </Button>
                </div>
            ) : (
                // UNLOCKED STATE - THE CERTIFICATE
                <div className="animate-fade-in w-full max-w-4xl">
                    <div className="text-center mb-8">
                        <Button
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" /> Tải xuống PDF
                        </Button>
                    </div>

                    {/* Certificate Paper */}
                    <div className="bg-[#fffcf5] text-slate-900 p-12 rounded shadow-2xl relative overflow-hidden border-[16px] border-double border-[#1e293b] print:shadow-none print:border-8">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                            <ShieldCheck className="w-96 h-96" />
                        </div>

                        <div className="relative z-10 text-center border-4 border-amber-500/20 p-8 h-full">
                            {/* Header */}
                            <div className="flex justify-center mb-8">
                                <Award className="w-16 h-16 text-amber-600" />
                            </div>

                            <h1 className="text-5xl font-serif text-slate-800 mb-4 tracking-wide uppercase">Chứng Nhận Hoàn Thành</h1>
                            <p className="text-xl text-slate-500 italic mb-12">Trao tặng cho</p>

                            {/* Student Name */}
                            <h2 className="text-4xl font-bold text-indigo-900 mb-12 font-serif border-b-2 border-slate-200 inline-block pb-4 px-12">
                                {certData?.studentName || "Sinh Viên"}
                            </h2>

                            <p className="text-lg text-slate-600 mb-4">Đã hoàn thành xuất sắc khóa học</p>
                            <h3 className="text-2xl font-bold text-slate-800 mb-16 uppercase tracking-wider">
                                {certData?.courseName}
                            </h3>

                            {/* Footer */}
                            <div className="flex justify-between items-end mt-auto px-12">
                                <div className="text-left">
                                    <p className="text-slate-500 text-sm mb-1">Mã chứng chỉ</p>
                                    <p className="font-mono text-slate-700 font-bold">{certData?.id}</p>
                                    <p className="text-slate-400 text-xs mt-1">Ngày cấp: {new Date(certData?.issueDate || "").toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="text-center">
                                    <div className="h-16 mb-2 border-b border-slate-400 w-48 mx-auto">
                                        {/* Signature Placeholder */}
                                        <span className="font-cursive text-3xl text-indigo-800 leading-[4rem]">Admin</span>
                                    </div>
                                    <p className="text-slate-800 font-bold">Giảng viên / Quản trị viên</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
