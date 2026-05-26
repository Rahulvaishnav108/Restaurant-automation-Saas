import React, { useState } from 'react';
import { ChevronLeft, CreditCard, QrCode, ShieldCheck, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../store/customer.store';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [paid, setPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const totalPrice = useCustomerStore((state) => state.getTotalPrice());
  const orders = useCustomerStore((state) => state.orders);
  const payable = totalPrice || orders[0]?.total || 0;
  const canPay = payable > 0 && (method === 'cash' || method === 'upi' || cardNumber.replace(/\s/g, '').length >= 12);

  return (
    <div className="min-h-screen bg-[#0a0d17] text-white max-w-md mx-auto">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0d17]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="rounded-full p-1.5 transition hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></button>
          <div>
            <p className="text-sm font-semibold">Online Payment</p>
            <p className="text-xs text-slate-400">Secure bill settlement</p>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-4 py-5">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Amount payable</p>
          <p className="mt-2 text-4xl font-black">₹{payable}</p>
          <p className="mt-2 text-xs text-slate-500">Includes active cart or latest table bill.</p>
        </section>

        <section className="space-y-3">
          {([
            ['upi', 'UPI / QR Pay', QrCode],
            ['card', 'Debit or Credit Card', CreditCard],
            ['cash', 'Cash at Counter', Wallet],
          ] as const).map(([value, label, Icon]) => (
            <button key={value} onClick={() => setMethod(value)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${method === value ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              <Icon className="h-5 w-5 text-orange-400" />
              <span className="flex-1 text-sm font-semibold">{label}</span>
              <span className={`h-4 w-4 rounded-full border ${method === value ? 'border-orange-400 bg-orange-500' : 'border-slate-500'}`} />
            </button>
          ))}
        </section>

        {method === 'upi' && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border border-orange-500/30 bg-white">
              <QrCode className="h-20 w-20 text-slate-900" />
            </div>
            <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="UPI ID, optional" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-orange-500" />
          </section>
        )}

        {method === 'card' && (
          <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="Card number" inputMode="numeric" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-orange-500" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="MM/YY" inputMode="numeric" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-orange-500" />
              <input placeholder="CVV" inputMode="numeric" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-orange-500" />
            </div>
          </section>
        )}

        {method === 'cash' && (
          <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
            A waiter will collect cash at your table and mark the bill as settled.
          </section>
        )}

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-green-400" />
          Payments are protected with secure table bill verification.
        </div>

        <button onClick={() => setPaid(true)} disabled={!canPay} className="w-full rounded-2xl bg-orange-500 py-3 font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-700">
          Pay ₹{payable}
        </button>

        {paid && <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Payment successful. Thank you for dining with us.</p>}
      </main>
    </div>
  );
};

export default PaymentPage;
