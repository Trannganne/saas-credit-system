import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const [credits, setCredits] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [unlockedFeatures, setUnlockedFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(null); // Lưu id tính năng đang xử lý click

    const { logout } = useAuth();
    const navigate = useNavigate();

    // 1. Ánh xạ giao diện (UI Mapping): Chỉ dùng để bù đắp Icon/Emoji cho đẹp mắt 
    // Dựa theo chính xác trường "name" trong file seed.py của bạn
    const featureUIMapping = {
        "create_image": { icon: "🎨" },
        "auto_post": { icon: "🚀" },
        "export_pdf": { icon: "📄" },
        "send_email": { icon: "✉️" }
    };

    // Hàm lấy thông tin tổng quan để tái sử dụng khi cần cập nhật lại số dư sau khi click sử dụng
    const fetchDashboardData = async () => {
        try {
            const [creditsRes, transactionsRes, featuresRes] = await Promise.all([
                api.get("/users/me/credits"),
                api.get("/users/me/transactions"),
                api.get("/users/me/features")
            ]);
            setCredits(creditsRes.data.balance);
            setTransactions(transactionsRes.data);
            setUnlockedFeatures(featuresRes.data);
        } catch (err) {
            console.error("Lỗi đồng bộ dữ liệu hệ thống:", err);
            if (err.response?.status === 404 && err.config.url.includes("features")) {
                setUnlockedFeatures([]); // Trường hợp chưa sở hữu tính năng nào
            } else {
                setError("Có lỗi xảy ra khi đồng bộ dữ liệu ví và quyền hạn.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // 2. Logic gọi API giả lập dùng tính năng và trừ Credit thực tế từ Backend
    const handleUseFeature = async (featureName, featureId) => {
        setError("");
        setSuccessMessage("");
        setActionLoading(featureId); // Bật hiệu ứng loading riêng cho nút của tính năng đó

        try {
            // Gọi chính xác đến Route Router POST /tools/{feature_name}
            const res = await api.post(`/tools/${featureName}`);

            if (res.data.status === "granted") {
                setSuccessMessage(res.data.message || `Kích hoạt thành công tác vụ ${featureName}!`);

                // Cập nhật lại số dư hiển thị ngay trên giao diện mà không cần load lại trang
                await fetchDashboardData();
            }
        } catch (err) {
            console.error("Lỗi thực thi tính năng:", err);
            // Hiển thị trực tiếp lỗi HTTPException (403, lỗi gói, lỗi thiếu tiền) từ Backend trả về
            setError(err.response?.data?.detail || "Không thể thực thi tính năng này.");
        } finally {
            setActionLoading(null);
        }
    };

    const renderStatusBadge = (status) => {
        const lowerStatus = status?.toLowerCase();
        if (lowerStatus === "completed" || lowerStatus === "success" || lowerStatus === "thành công") {
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Thành công</span>;
        }
        if (lowerStatus === "pending" || lowerStatus === "chờ xử lý") {
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Chờ xử lý</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">{status || "Thất bại"}</span>;
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased flex flex-col">

            {/* Navigation Header Bar */}
            <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                            S
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">SaaS System</span>
                    </div>

                    <button
                        onClick={() => { logout(); navigate("/login"); }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 transition-all duration-150 cursor-pointer"
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Upper Greeting & Credits Balance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Dashboard</h2>
                        <p className="text-sm text-slate-500 font-medium">Giải pháp quản lý credits thông minh cho các dịch vụ SaaS hiện đại.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits hiện tại</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">
                                    {credits !== null ? credits.toLocaleString() : "..."}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">credits</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/packages")}
                            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer"
                        >
                            Mua thêm gói
                        </button>
                    </div>
                </div>

                {/* Status Dynamic Feedback Toast Alerts */}
                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                        ❌ {error}
                    </div>
                )}
                {successMessage && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                        ✅ {successMessage}
                    </div>
                )}

                {/*  DANH SÁCH & SỬ DỤNG TÍNH NĂNG */}
                <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                        <h3 className="text-lg font-bold text-slate-900">Quản lý tính năng hệ thống</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Các tính năng được kích hoạt cho tài khoản.</p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-slate-400 font-medium">Đang đồng bộ dữ liệu quyền hạn...</div>
                    ) : unlockedFeatures.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-2">
                            <p className="text-sm font-semibold text-slate-700">Tài khoản chưa sở hữu tính năng nào!</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">Vui lòng di chuyển đến trang Gói để thực hiện mua sắm kích hoạt quyền lợi sử dụng hệ thống.</p>
                            <button onClick={() => navigate("/packages")} className="text-xs font-bold text-indigo-600 hover:underline mt-2 block mx-auto">Xem danh sách gói ngay →</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Render động dựa theo mảng unlockedFeatures lấy từ API /users/me/features */}
                            {unlockedFeatures.map((feat) => {

                                const uiConfig = featureUIMapping[feat.name] || { icon: "⚙️" };
                                const isProcessing = actionLoading === feat.id;

                                return (
                                    <div
                                        key={feat.id}
                                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center justify-between gap-6 hover:border-indigo-500/40 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-inner">
                                                {uiConfig.icon}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-slate-900">{feat.description}</h4>
                                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">{feat.name}</span>
                                                </div>
                                                <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                                                    Cần: <span className="font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{feat.cost} credits</span> / lượt dùng
                                                </p>
                                            </div>
                                        </div>

                                        {/* Nút bấm gọi API /tools/{feature_name} */}
                                        <button
                                            disabled={isProcessing || (credits !== null && credits < feat.cost)}
                                            onClick={() => handleUseFeature(feat.name, feat.id)}
                                            className={`inline-flex items-center justify-center min-w-[90px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 border active:scale-[0.97] ${credits !== null && credits < feat.cost
                                                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                                                : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800 hover:border-slate-800 cursor-pointer shadow-sm"
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : credits !== null && credits < feat.cost ? (
                                                "Không đủ ví"
                                            ) : (
                                                "Sử dụng"
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* History Transactions List */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Lịch sử mua credits</h3>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400 font-medium">Đang tải lịch sử...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 text-sm">Bạn chưa thực hiện giao dịch nào!</div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Gói</th>
                                        <th className="px-6 py-4">Credits nhận</th>
                                        <th className="px-6 py-4">Giá thanh toán</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4 text-right">Ngày mua</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                    {transactions.map((t, index) => (
                                        <tr key={t.id || index} className="hover:bg-slate-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4 font-bold text-slate-900">{t.package?.name || "Gói cũ"}</td>
                                            <td className="px-6 py-4 text-indigo-600 font-semibold">+{t.credits_added?.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-semibold">{t.amount?.toLocaleString()}đ</td>
                                            <td className="px-6 py-4">{renderStatusBadge(t.status)}</td>
                                            <td className="px-6 py-4 text-right text-slate-400 font-normal">
                                                {t.created_at ? new Date(t.created_at).toLocaleDateString("vi-VN") : "---"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}