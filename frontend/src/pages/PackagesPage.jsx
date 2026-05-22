import { use, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PackagesPage() {
    const [packages, setPackages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/packages").then(async (res) => {
            const pkgs = res.data;

            // Fetch features cho từng package song song
            const pkgWithFeatures = await Promise.all(
                pkgs.map(async (pkg) => {
                    const featRes = await api.get(`/packages/${pkg.id}/features`);
                    return { ...pkg, features: featRes.data };
                })
            );

            console.log(pkgWithFeatures);
            setPackages(pkgWithFeatures);


        });
    }, []);

    const handleBuy = async (packageId) => {
        try {
            await api.post("/purchase/", { package_id: packageId });
            setMessage("Mua thành công! Credits đã được cộng vào tài khoản");
            setTimeout(() =>
                navigate("/dashboard")
                , 1500);

            await api.get("/{package_id}/features", { package_id: packageId });

        } catch (e) {
            setMessage(e.response?.data?.detail || "Mua thất bại!");

        }
    };

    // Kiểm tra tin nhắn là thành công hay thất bại để đổi màu
    const isSuccess = message.includes("thành công");

    return (
        <div className="min-h-creen w-full bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 antialiased">
            <div className=" max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 pb-6 border-b border-slate-200/60">
                    <div className="text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Danh sách các gói Credits</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500 font-medium">
                            Nâng cấp tài khoản của bạn với các gói credits linh hoạt để mở khóa toàn bộ tính năng cao cấp.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 border border-slate-200 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer text-sm self-start sm:self-center whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Quay lại Dashboard
                    </button>                </div>


                {message && (
                    <div className={`max-w-md mx-auto mb-8 p-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${isSuccess
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                        {isSuccess ? (
                            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 133l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {message}
                    </div>
                )}
                {/* Pricing grid layout Tự động co giãn */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {packages.map((pkg) => {
                        const isPopular = pkg.credits >= 500;

                        return (
                            <div key={pkg.id}
                                className={`relative flex flex-col justify-between bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 ${isPopular
                                    ? "border-indigo-600 shadow-[0_15px_30px_rgba(79,70,229,0.08)] ring-2 ring-indigo-600/10"
                                    : "border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)]"
                                    }`}>
                                {isPopular && (
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold tracking-wider uppercase py-1 px-3.5 rounded-full shadow-sm">
                                        Phổ biến nhất
                                    </span>
                                )}

                                {/*Card body top*/}
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed min-h-[40px] mb-6">
                                        {pkg.description || "Không có mô tả cho gói này."}
                                    </p>

                                    {/* Tính năng đi kèm */}
                                    <div className="mb-6 space-y-3 text-left border border-t border-slate-100 pt-4 flex-1 p-3">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Features:
                                        </p>
                                        {pkg.features && pkg.features.length > 0 ? (
                                            <div className="flex flex-col gap-2.5">
                                                {(pkg.features || []).map((f) => (
                                                    <div key={f.id} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center text-[10px] font-bold mt-0.5">
                                                            ✓
                                                        </span>
                                                        <span className="leading-tight">
                                                            {f.description || f.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs italic text-slate-400">
                                                Không có tính năng đi kèm!
                                            </p>
                                        )}
                                    </div>


                                    {/*Số credits*/}
                                    <div className="flex items-baseline gap-1.5 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <span className="text-3xl font-black  text-slate-900 tracking-tight">
                                            {pkg.credits.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-bold text-slate-500 uppercase  tracking-wider">
                                            Credits
                                        </span>
                                    </div>
                                </div>

                                {/*Card body bottom*/}
                                <div>
                                    {/*Hiển thị giá tiền */}
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Price
                                        </span>
                                        <span className="text-2xl font-extrabold text-indigo-600">
                                            {pkg.price.toLocaleString()}$
                                        </span>
                                    </div>
                                    {/*Nút mua */}
                                    <button onClick={() => handleBuy(pkg.id)}
                                        className={`w-full py-3.5 px-4 rounded-xl font-semibold active:scale-[0.985] shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5 group text-sm cursor-pointer ${isPopular
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10"
                                            : "bg-slate-900 text-white hover:bg-slate-800"
                                            }`}>
                                        Buy Now
                                        <svg className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div >

    )
}