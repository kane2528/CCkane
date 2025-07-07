import { useState, useEffect } from "react"
import { CreditCard, User, Mail, CheckCircle, Loader2, AlertTriangle, Sun, Moon } from "lucide-react"
import Image from "next/image"
import { FaRupeeSign } from "react-icons/fa"
import axios from "axios"
import Navbar from "./components/navbar"
import Cookies from "js-cookie"

const PaymentPage = () => {
    const [theme, setTheme] = useState("dark")
    const [form, setForm] = useState({
        name: "",
        email: "",
        amount: "250",
        referralCode: "",
    })
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [orderId, setOrderId] = useState(null)

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    // 🔥 Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // 🔥 Payment Initiation
    const handlePayWithRazorpay = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        setSuccess(false)

        try {
            const token = Cookies.get("token")
            const userId = Cookies.get("userId")
            const amountInPaise = Math.round((process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || 499) * 100)

            if (!token || !userId) {
                setError("User not authenticated")
                setLoading(false)
                return
            }

            // Step 1: Create Order
            const res = await axios.post(
                "http://localhost:3006/api/payment/create-order",
                {
                    referralCode: form.referralCode || "",
                    userId,
                    amount: amountInPaise,
                    currency: "INR",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const { success, orderId, amount: orderAmount, currency, message } = res.data

            if (!success) {
                setError(message || "Failed to create payment order")
                setLoading(false)
                return
            }

            setOrderId(orderId)

            // 🔥 Step 2: Launch Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_KEY_ID,
                amount: 250 * 100, // Amount in paise
                currency: "INR",
                name: "Your App Name",
                description: "Access to premium content",
                order_id: orderId,
                prefill: {
                    name: form.name,
                    email: form.email,
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            "http://localhost:3006/api/payment/verify-payment",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )

                        if (verifyRes.data.success) {
                            setSuccess(true)
                        } else {
                            setError("Payment verification failed")
                        }
                    } catch (err) {
                        console.error("Verification error:", err)
                        setError("Verification failed. Try again.")
                    } finally {
                        setLoading(false)
                    }
                },
                theme: {
                    color: theme === "dark" ? "#facc15" : "#4f46e5",
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            console.error("Full error:", err)
            setError("Payment initiation failed")
            setLoading(false)
        }
    }

    // 🔥 Admin-only Refund Button
    const handleRefundAll = async () => {
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            const token = Cookies.get("token")
            if (!token) {
                setError("User not authenticated")
                setLoading(false)
                return
            }

            const res = await axios.post(
                "http://localhost:3006/api/payment/initiate-refund-for-all",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (res.data.success) {
                alert(`✅ Refunds Processed\n\nSuccessful: ${res.data.successfulRefunds.length}\nFailed: ${res.data.failedRefunds.length}`)
            } else {
                setError(res.data.message || "Refund failed")
            }
        } catch (err) {
            console.error("Refund error:", err)
            setError("Refund request failed. Check console.")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
            : "bg-gradient-to-br from-yellow-50 via-indigo-50 to-purple-50"
            }`}>
            <Navbar theme={theme} setTheme={setTheme} />
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`fixed bottom-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border hover:scale-110 transition-all duration-300 ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20"
                    : "bg-indigo-100 border-indigo-200 text-indigo-600 hover:bg-indigo-200"
                    }`}>
                {theme === "dark" ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-900" />}
            </button>

            <div className={`max-w-md w-full rounded-3xl shadow-2xl border backdrop-blur-xl ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-indigo-200"} p-8 md:p-12 mt-10`}>
                <div className="flex flex-col items-center mb-8">
                    <CreditCard className={`w-14 h-14 mb-4 ${theme === "dark" ? "text-yellow-400" : "text-indigo-600"}`} />
                    <h2 className={`text-3xl font-black mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>Secure Payment</h2>
                    <p className={`text-lg text-center ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}>Complete your payment to unlock premium access</p>
                </div>

                {loading && (
                    <div className="flex flex-col items-center py-6">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                        <div className="text-indigo-500 font-semibold">Processing...</div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-100 text-red-700 border border-red-200">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="flex flex-col items-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                        <p className="text-center text-lg">Thank you for your payment. Enjoy your access!</p>
                        {/* Refund Button - visible to all users */}
                        <button
                            onClick={handleRefundAll}
                            className="mt-6 w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300"
                        >
                            Initiate Bulk Refund
                        </button>

                    </div>
                ) : (
                    <form onSubmit={handlePayWithRazorpay} className="space-y-5">
                        <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}>Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" required value={form.name} onChange={e => handleChange("name", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 ${theme === "dark"
                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"}`} placeholder="Full Name" />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" required value={form.email} onChange={e => handleChange("email", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 ${theme === "dark"
                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"}`} placeholder="you@email.com" />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}>Referral Code (optional)</label>
                            <input type="text" value={form.referralCode} onChange={e => handleChange("referralCode", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 ${theme === "dark"
                                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                    : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"}`} placeholder="Referral Code" />
                        </div>

                        <div>
                            <label className={`block text-sm font-bold mb-2 ${theme === "dark" ? "text-gray-300" : "text-indigo-700"}`}>Amount</label>
                            <div className="relative">
                                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="number" required min={1} value={form.amount} disabled
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 ${theme === "dark"
                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                                        : "bg-white border-indigo-200 text-indigo-900 placeholder-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"}`} placeholder="Amount" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className={`w-full py-4 rounded-xl font-black text-white transition-transform hover:scale-105 ${theme === "dark"
                                ? "bg-gradient-to-r from-indigo-500 to-yellow-400"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600"} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                            {loading ? "Processing..." : "Pay with Razorpay"}
                        </button>
                    </form>
                )}

                {/* 🔥 Admin-only Refund Button */}
                {Cookies.get("role") === "admin" && (
                    <button onClick={handleRefundAll} className="mt-6 w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300">
                        Initiate Bulk Refund (Admin)
                    </button>
                )}
            </div>
        </div>
    )
}

export default PaymentPage
