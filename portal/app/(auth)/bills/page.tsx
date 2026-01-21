import { Receipt, Download, CheckCircle, Clock } from 'lucide-react'

// TODO: Fetch from Supabase
const bills = [
    {
        id: '1',
        month: 'January 2026',
        amount: 2450.00,
        paid: false,
        pdfUrl: '/bills/january-2026.pdf',
        dueDate: '2026-01-31'
    },
    {
        id: '2',
        month: 'December 2025',
        amount: 2380.00,
        paid: true,
        pdfUrl: '/bills/december-2025.pdf',
        dueDate: '2025-12-31'
    },
    {
        id: '3',
        month: 'November 2025',
        amount: 2380.00,
        paid: true,
        pdfUrl: '/bills/november-2025.pdf',
        dueDate: '2025-11-30'
    },
    {
        id: '4',
        month: 'October 2025',
        amount: 2350.00,
        paid: true,
        pdfUrl: '/bills/october-2025.pdf',
        dueDate: '2025-10-31'
    },
]

export default function BillsPage() {
    const totalOutstanding = bills
        .filter(b => !b.paid)
        .reduce((sum, b) => sum + b.amount, 0)

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                    My Bills
                </h1>
                <p className="text-slate-600 mt-1">
                    View and download your monthly statements
                </p>
            </div>

            {/* Outstanding Balance Card */}
            {totalOutstanding > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-800">Outstanding Balance</p>
                            <p className="text-3xl font-bold text-amber-900 mt-1">
                                R {totalOutstanding.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Bills List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Statement History</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                        <div
                            key={bill.id}
                            className="p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bill.paid ? 'bg-emerald-100' : 'bg-amber-100'
                                    }`}>
                                    <Receipt className={`w-5 h-5 ${bill.paid ? 'text-emerald-600' : 'text-amber-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{bill.month}</p>
                                    <p className="text-sm text-slate-500">Due: {bill.dueDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-semibold text-slate-800">
                                        R {bill.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {bill.paid ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs text-emerald-600 font-medium">Paid</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4 text-amber-500" />
                                                <span className="text-xs text-amber-600 font-medium">Pending</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={bill.pdfUrl}
                                    download
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Download PDF"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Text */}
            <p className="text-sm text-slate-500 mt-6 text-center">
                For payment queries, contact the office at{' '}
                <a href="tel:+27123456789" className="text-amber-600 hover:underline">
                    (012) 345-6789
                </a>
            </p>
        </div>
    )
}
