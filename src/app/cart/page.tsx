'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { clearCart, removeFromCart, setCart, updateQuantity } from '@/redux/cartSlice'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { X, Phone, User, CreditCard, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/components/ui/Toast'
import Header from '@/components/ui/Header'
import Image from 'next/image'
const page = () => {
    return (
        <div>
            <CartPage />

        </div>
    )
}

export default page



const CartPage = () => {
    const { t } = useTranslation('common')
    const dispatch = useDispatch()
    const cartItems = useSelector((state: RootState) => state.cart)
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cash'>('cash')
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        people: 2,
        date: '',
        time: ''
    })

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    const handleRemoveItem = (id: number) => {
        dispatch(removeFromCart(id))
        showToast(t('cart.removed'), 'success')
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return
        dispatch(updateQuantity({ id, quantity: newQuantity }))
    }

    const handleCheckout = () => {
        // Validate form
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.date || !customerInfo.time) {
            showToast(t('cart.fillRequiredFields'), 'error')
            return
        }

        // Process order based on payment method
        if (paymentMethod === 'momo') {
            // Handle MoMo payment
            showToast(t('cart.redirectToPayment'), 'info')
            // window.location.href = process.env.NEXT_PUBLIC_MOMO_PAYMENT_URL
        } else {
            // Handle cash payment
            showToast(t('cart.orderPlaced'), 'success')
            // Here you would typically send the order to your backend
            dispatch(clearCart())
        }
    }

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
        if (savedCart) {
            dispatch(setCart(JSON.parse(savedCart)))
        }
    }, [dispatch])

    return (
        <>
            <Header />
            <div className='w-full h-16 bg-gradient-to-r from-amber-200 to-slate-500 flex items-center justify-center'></div>
            <div className="w-full mx-auto px-4 py-12">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t('cart.yourOrder')}</h1>
                    <div className="w-24 h-1 bg-rose-500 mx-auto"></div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Cart items */}
                    <div className="lg:col-span-2">
                        {cartItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-xl shadow-md p-8 text-center"
                            >
                                <h2 className="text-xl font-medium text-gray-700 mb-4">{t('cart.empty')}</h2>
                                <Link
                                    href="/menu"
                                    className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    {t('cart.browseMenu')}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div className="divide-y divide-gray-200">
                                    {cartItems?.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="p-6 flex flex-col sm:flex-row gap-6"
                                        >
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={item.image_url || '/images/default-food.jpg'}
                                                    alt={item.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-gray-400 hover:text-rose-600 transition-colors"
                                                        aria-label={t('cart.remove')}
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                                            className="px-3 py-1 text-gray-600 hover:text-rose-600"
                                                            disabled={(item.quantity || 1) <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-center w-8">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                                            className="px-3 py-1 text-gray-600 hover:text-rose-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className="text-lg font-medium text-rose-600">
                                                        {(item.price * (item.quantity || 1)).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right column - Order summary and customer info */}
                    <div className="space-y-6">
                        {/* Customer information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <User size={20} />
                                {t('cart.customerInfo')}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('cart.fullName')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('cart.email')}
                                    </label>
                                    <input
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('cart.phone')} *
                                    </label>
                                    <input
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('cart.people')} *
                                        </label>
                                        <select
                                            value={customerInfo.people}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, people: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                        >
                                            {[2, 4, 6, 8, 10, 15, 20, 25, 30].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? t('cart.person') : t('cart.people')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('cart.date')} *
                                        </label>
                                        <input
                                            type="date"
                                            value={customerInfo.date}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('cart.time')} *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={customerInfo.time}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, time: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                            required
                                        />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            ({t('cart.max1Hour')})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment method */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} />
                                {t('cart.paymentMethod')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="payment"
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                                    />
                                    <label htmlFor="cash" className="flex items-center gap-2">
                                        <DollarSign size={16} />
                                        {t('cart.payAtRestaurant')}
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="momo"
                                        name="payment"
                                        checked={paymentMethod === 'momo'}
                                        onChange={() => setPaymentMethod('momo')}
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                                    />
                                    <label htmlFor="momo" className="flex items-center gap-2">
                                        <Image
                                            src="/images/momo-logo.png"
                                            width={16}
                                            height={16}
                                            alt="MoMo"
                                            className="h-4 w-auto"
                                        />
                                        {t('cart.payWithMomo')}
                                    </label>
                                </div>
                                {paymentMethod === 'momo' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {t('cart.scanToPay')}
                                            </p>
                                            <Image
                                                src={process.env.NEXT_PUBLIC_MOMO_QR_CODE || '/images/momo-qr-placeholder.png'}
                                                width={160}
                                                height={160}
                                                alt="MoMo QR Code"
                                                className="w-40 h-40 mx-auto"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Order summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-medium text-gray-800 mb-4">
                                {t('cart.orderSummary')}
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                                    <span>{subtotal.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('cart.tax')} (10%)</span>
                                    <span>{tax.toLocaleString()}₫</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-medium text-lg">
                                    <span>{t('cart.total')}</span>
                                    <span className="text-rose-600">{total.toLocaleString()}₫</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    {paymentMethod === 'momo' ? t('cart.payNow') : t('cart.placeOrder')}
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors">
                                    <Phone size={18} />
                                    {t('cart.callToOrder')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    )
}
