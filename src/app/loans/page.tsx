"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { loans, documentChecklist, farmerProfile } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { Landmark, CheckCircle2, Circle, ExternalLink, Calculator, ChevronDown, ChevronUp, Shield, Clock, ArrowRight, FileText } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LoansPage() {
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState(200000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(4.0);

  const emi = Math.round(
    (loanAmount * (interestRate / 1200) * Math.pow(1 + interestRate / 1200, tenure)) /
    (Math.pow(1 + interestRate / 1200, tenure) - 1)
  );
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - loanAmount;

  const completedDocs = documentChecklist.filter((d) => d.completed).length;

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-gray-900">Loan Eligibility</h1>
          <p className="text-sm text-gray-500">Check your loan options and apply for Kisan credit</p>
        </motion.div>

        {/* Profile Summary */}
        <motion.div variants={item} className="gc p-5 flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
            {farmerProfile.avatar}
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="font-bold text-gray-900">{farmerProfile.name}</p>
            <p className="text-xs text-gray-500">{farmerProfile.district}, {farmerProfile.state} • {farmerProfile.acres} acres</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Crops</p>
              <p className="text-sm font-bold text-gray-800">{farmerProfile.crops.join(", ")}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Docs Ready</p>
              <p className="text-sm font-bold text-emerald-600">{completedDocs}/{documentChecklist.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Loan Options */}
        <motion.div variants={item}>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Available Loan Options</h2>
          <div className="space-y-3">
            {loans.map((loan) => (
              <div key={loan.id} className="gc overflow-hidden">
                <button onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      loan.status === "Pre-Approved" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{loan.type}</p>
                      <p className="text-xs text-gray-500">{loan.bank} • {loan.tenure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.limit)}</p>
                      <p className="text-xs text-gray-500">@ {loan.effectiveRate}% p.a.</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      loan.status === "Pre-Approved" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {loan.status}
                    </span>
                    {selectedLoan === loan.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>
                
                {selectedLoan === loan.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-5 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">Max Limit</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.limit)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">Interest Rate</p>
                        <p className="text-lg font-bold text-emerald-600">{loan.effectiveRate}%</p>
                        {loan.subsidyRate > 0 && <p className="text-[10px] text-amber-600">Subsidy: {loan.subsidyRate}%</p>}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">EMI (approx)</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.emi)}/mo</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Key Features</p>
                      <div className="flex flex-wrap gap-2">
                        {loan.features.map((f) => (
                          <span key={f} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      Apply Now <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* EMI Calculator */}
          <motion.div variants={item} className="gc p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">EMI Calculator</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
                </div>
                <input type="range" min={10000} max={1000000} step={10000} value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Tenure</label>
                  <span className="text-sm font-bold text-gray-900">{tenure} months</span>
                </div>
                <input type="range" min={3} max={60} value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                  <span className="text-sm font-bold text-gray-900">{interestRate}%</span>
                </div>
                <input type="range" min={2} max={15} step={0.5} value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Monthly EMI</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(emi)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Interest</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Payable</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPayable)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Document Checklist */}
          <motion.div variants={item} className="gc p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Document Checklist</h3>
              </div>
              <span className="badge badge-success">{completedDocs}/{documentChecklist.length} Ready</span>
            </div>
            <div className="space-y-2">
              {documentChecklist.map((doc) => (
                <div key={doc.name} className={`flex items-center gap-3 p-3 rounded-xl transition ${doc.completed ? "bg-emerald-50" : "bg-gray-50"}`}>
                  {doc.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${doc.completed ? "text-emerald-700" : "text-gray-500"}`}>
                    {doc.name}
                  </span>
                  {!doc.completed && (
                    <span className="ml-auto text-xs text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
