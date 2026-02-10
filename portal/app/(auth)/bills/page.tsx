import { Receipt, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ResidentBillsList from '@/components/ResidentBillsList'

export default async function BillsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch Resident ID
    const { data: resident } = await supabase
        .from('residents')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

    // 2. Fetch Bills
    const { data: bills, error } = await supabase
        .from('bills')
        .select('id, month, amount, is_paid, pdf_url, page_number, invoice_number')
        .eq('resident_id', resident?.id)
        .order('month', { ascending: false })

    if (error) {
        return (
            <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-100 italic">
                Error loading statements: {error.message}
            </div>
        )
    }

    const totalOutstanding = bills
        ?.filter(b => !b.is_paid)
        .reduce((sum, b) => sum + b.amount, 0) || 0

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-serif font-bold text-slate-900">
                    My Statements
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Manage your levy account and view payment history
                </p>
            </div>

            {/* Outstanding Balance Card */}
            {totalOutstanding > 0 && (
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 font-medium mb-1 uppercase tracking-wider text-xs">Total Outstanding</p>
                            <p className="text-4xl font-bold">
                                R {totalOutstanding.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Clock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <Receipt className="absolute -bottom-8 -right-8 w-40 h-40 text-white/10 -rotate-12" />
                </div>
            )}

            {/* Bills List */}
            <ResidentBillsList bills={bills || []} />

            {/* Help Text */}
            <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center">
                <h4 className="font-bold text-slate-800 mb-2">Need Assistance?</h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    If you have any questions regarding your statement or would like to discuss payment arrangements, please contact the Ryn Village office.
                </p>
                <div className="mt-4 flex items-center justify-center gap-6">
                    <a href="tel:+27123456789" className="text-amber-600 font-bold hover:underline">
                        (012) 345-6789
                    </a>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <a href="mailto:office@rynvillage.co.za" className="text-amber-600 font-bold hover:underline">
                        office@rynvillage.co.za
                    </a>
                </div>
            </div>
        </div>
    )
}
