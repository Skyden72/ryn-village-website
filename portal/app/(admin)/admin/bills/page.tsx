import { createClient } from '@/lib/supabase/server'
import { Upload } from 'lucide-react'
import Link from 'next/link'
import BillsTable from '@/components/admin/BillsTable'

export const dynamic = 'force-dynamic'

export default async function AdminBillsPage() {
    const supabase = await createClient()

    // Fetch bills with resident details
    const { data: bills, error } = await supabase
        .from('bills')
        .select(`
            id,
            created_at,
            month,
            amount,
            is_paid,
            paid_at,
            pdf_url,
            page_number,
            invoice_number,
            residents (
                full_name,
                unit_number
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="p-8 text-red-400">
                Error loading bills: {error.message}
            </div>
        )
    }

    // Explicitly cast or map to ensure type safety if needed, 
    // though Supabase return type usually matches if schema is generated.
    // For now, passing 'bills' directly as it matches the shape expected by BillsTable (mostly).
    // BillsTable expects residents to be an object or null.

    // Calculate stats
    const totalUnpaid = bills.filter(b => !b.is_paid).reduce((sum, b) => sum + b.amount, 0)
    const unpaidCount = bills.filter(b => !b.is_paid).length
    const paidCount = bills.filter(b => b.is_paid).length

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">
                        Bills Management
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage resident invoices and payments
                    </p>
                </div>
                <Link
                    href="/admin/invoices"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg transition-all"
                >
                    <Upload className="w-5 h-5" />
                    Import Invoices
                </Link>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Total Outstanding</p>
                        <p className="text-2xl font-bold text-amber-400">
                            R {totalUnpaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Unpaid Bills</p>
                        <p className="text-2xl font-bold text-white">
                            {unpaidCount}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Paid Bills</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            {paidCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <BillsTable bills={bills as any} />
        </div>
    )
}
