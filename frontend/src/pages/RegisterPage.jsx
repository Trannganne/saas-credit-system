import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
    const [form, setForm] = useState({ full_name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/auth/register", form);
            navigate("/login");
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.detail || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
            {/* Khung Form Trắng Nổi Khối */}
            <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-xl p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Tạo tài khoản
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Đăng ký để trải nghiệm các tính năng thông minh của hệ thống
                    </p>
                </div>

                {/* Thông báo lỗi nếu có */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2.5 animate-fadeIn">
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {/* Form Đăng ký */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Input Họ Tên */}
                    <div className="flex flex-col text-left">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Họ và tên của bạn
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                name="full_name"
                                type="text"
                                required
                                placeholder="Nguyễn Văn A"
                                value={form.full_name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all duration-150"
                            />
                        </div>
                    </div>

                    {/* Input Email */}
                    <div className="flex flex-col text-left">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Địa chỉ Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all duration-150"
                            />
                        </div>
                    </div>

                    {/* Input Mật khẩu */}
                    <div className="flex flex-col text-left">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mật khẩu bảo mật
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all duration-150"
                            />
                        </div>
                    </div>

                    {/* Nút Đăng ký */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 bg-slate-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                Đăng ký tài khoản
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer chuyển trang */}
                <div className="text-center text-sm text-slate-500 mt-8 font-medium">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-0.5">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}