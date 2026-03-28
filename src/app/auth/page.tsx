"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Globe, ChevronRight, Leaf, MapPin, Wheat, User } from "lucide-react";
import { supportedLanguages, cropPredictionDefaults } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [acres, setAcres] = useState(5);
  const [crops, setCrops] = useState<string[]>([]);
  const router = useRouter();

  const handleLogin = () => { setStep(1); };
  const handleOtp = () => { setStep(2); };
  const handleLang = () => { setStep(3); };
  const handleProfile = () => { router.push("/dashboard"); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0a] via-[#0F1F0F] to-[#1A2E1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Leaf className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">KrishiAI</h1>
          <p className="text-emerald-400/70 text-sm mt-1">Smart Financial Assistant for Farmers</p>
        </div>

        <div className="glass-card-dark p-6 rounded-2xl border border-emerald-500/20">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[0,1,2,3].map((s)=>(
              <div key={s} className={`h-1.5 rounded-full transition-all ${step===s?"w-8 bg-emerald-400":"w-4 bg-white/20"}`} />
            ))}
          </div>

          {step === 0 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
              <h2 className="text-white text-lg font-semibold text-center">Login with Phone</h2>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400/60" />
                <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 transition" />
              </div>
              <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                Send OTP <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
              <h2 className="text-white text-lg font-semibold text-center">Enter OTP</h2>
              <p className="text-white/40 text-sm text-center">Sent to {phone || "+91 98765 43210"}</p>
              <div className="flex justify-center gap-3">
                {[0,1,2,3,4,5].map((i)=>(
                  <input key={i} type="text" maxLength={1} className="w-11 h-12 text-center bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-emerald-400/50 transition" />
                ))}
              </div>
              <button onClick={handleOtp} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                Verify & Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
              <h2 className="text-white text-lg font-semibold text-center flex items-center justify-center gap-2"><Globe className="w-5 h-5 text-emerald-400" /> Choose Language</h2>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {supportedLanguages.map((l)=>(
                  <button key={l.code} onClick={()=>setLang(l.code)}
                    className={`p-3 rounded-xl text-left transition-all border ${lang===l.code?"bg-emerald-500/20 border-emerald-400/50 text-emerald-400":"bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    <p className="text-sm font-medium">{l.native}</p>
                    <p className="text-xs opacity-50">{l.name}</p>
                  </button>
                ))}
              </div>
              <button onClick={handleLang} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
              <h2 className="text-white text-lg font-semibold text-center flex items-center justify-center gap-2"><User className="w-5 h-5 text-emerald-400" /> Farm Profile</h2>
              <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50" />
              <select value={state} onChange={e=>setState(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/70 focus:outline-none focus:border-emerald-400/50 appearance-none">
                <option value="" className="bg-gray-900">Select State</option>
                {cropPredictionDefaults.states.map(s=>(<option key={s} value={s} className="bg-gray-900">{s}</option>))}
              </select>
              <input placeholder="District" value={district} onChange={e=>setDistrict(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50" />
              <div>
                <label className="text-white/50 text-xs mb-1 block">Land Size: {acres} acres</label>
                <input type="range" min={1} max={100} value={acres} onChange={e=>setAcres(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Crops</label>
                <div className="flex flex-wrap gap-2">
                  {cropPredictionDefaults.crops.map(c=>(
                    <button key={c} onClick={()=>setCrops(prev=>prev.includes(c)?prev.filter(x=>x!==c):[...prev,c])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${crops.includes(c)?"bg-emerald-500/20 border-emerald-400/50 text-emerald-400":"bg-white/5 border-white/10 text-white/50 hover:text-white/80"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleProfile} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                Start Using KrishiAI 🚀
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
