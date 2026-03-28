"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Lock, ChevronRight, Leaf, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { DEMO_USERS, loginUser, getCurrentUser } from "@/lib/userAuth";

export default function AuthPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Already logged in? redirect
  useEffect(() => {
    if (getCurrentUser()) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError("Please enter phone and password.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // smooth UX delay
    const user = loginUser(phone.trim(), password.trim());
    if (user) {
      router.push("/dashboard");
    } else {
      setError("Invalid phone or password. Try a demo account below.");
      setLoading(false);
    }
  };

  const quickLogin = async (u: typeof DEMO_USERS[0]) => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 300));
    loginUser(u.phone, u.password);
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--green-500)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
            }}
          >
            <Leaf style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>KrishiAI</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            Smart Financial Assistant for Indian Farmers
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card"
          style={{ padding: 28 }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Sign In
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 16,
              }}
            >
              <AlertCircle style={{ width: 15, height: 15, color: "#DC2626", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>
            </motion.div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Phone Number
              </label>
              <div style={{ position: "relative" }}>
                <Phone style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "11px 14px 11px 38px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: 10, fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 150ms ease",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--green-500)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-muted)" }} />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "11px 14px 11px 38px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: 10, fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--green-500)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "12px 24px",
                background: loading ? "var(--text-muted)" : "var(--green-500)",
                color: "#fff", borderRadius: 10, border: "none",
                fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 150ms ease, transform 150ms ease",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--green-600)"; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--green-500)"; }}
              onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
              onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              {loading ? "Signing in…" : <>Sign In <ChevronRight style={{ width: 16, height: 16 }} /></>}
            </button>
          </div>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            — Demo Accounts (click to login) —
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_USERS.map((u, i) => {
              const colors = ["rgba(34,197,94,0.1)", "rgba(59,130,246,0.1)", "rgba(139,92,246,0.1)"];
              const accentColors = ["var(--green-600)", "#2563EB", "#7C3AED"];
              return (
                <motion.button
                  key={u.uid}
                  onClick={() => quickLogin(u)}
                  disabled={loading}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    textAlign: "left",
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = accentColors[i];
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: colors[i],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: accentColors[i],
                    flexShrink: 0,
                  }}>
                    {u.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{u.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
                      {u.district}, {u.state} · {u.acres} acres · {u.crops.join(", ")}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>pw: <span style={{ fontWeight: 700, color: accentColors[i] }}>{u.password}</span></p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Health {u.healthScore}%</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 20 }}>
          KrishiAI v1.0 · Team CodeSmith · Hackathon 2026
        </p>
      </motion.div>
    </div>
  );
}
