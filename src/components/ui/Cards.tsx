"use client";
import { ReactNode } from "react";

/* ════════════════════════════════════════════
   CARD — Base container with hover elevation
   ════════════════════════════════════════════ */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}
export function Card({ children, className = "", hover = true, padding = "md" }: CardProps) {
  const pad = { none: "", sm: "p-4", md: "p-5", lg: "p-6" }[padding];
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl transition-all duration-200 ${hover ? "hover:shadow-md hover:-translate-y-0.5" : ""} ${pad} ${className}`}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   STAT CARD — KPI metric display
   ════════════════════════════════════════════ */
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
}
export function StatCard({ title, value, change, subtitle, icon, iconBg = "bg-green-50", iconColor = "text-green-600" }: StatCardProps) {
  return (
    <Card className="group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </Card>
  );
}

/* ════════════════════════════════════════════
   CHART CARD — Card with header + chart area
   ════════════════════════════════════════════ */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}
export function ChartCard({ title, subtitle, action, children, className = "" }: ChartCardProps) {
  return (
    <Card padding="lg" className={className}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

/* ════════════════════════════════════════════
   SECTION HEADER — Page / section title
   ════════════════════════════════════════════ */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ════════════════════════════════════════════
   ALERT CARD — Highlighted info/warning
   ════════════════════════════════════════════ */
interface AlertCardProps {
  icon: ReactNode;
  label: string;
  title: string;
  children: ReactNode;
  variant?: "danger" | "warning" | "info" | "success";
}
export function AlertCard({ icon, label, title, children, variant = "danger" }: AlertCardProps) {
  const styles = {
    danger: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
  };
  const labelColors = {
    danger: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
    success: "text-green-600",
  };
  return (
    <div className={`rounded-2xl border p-5 ${styles[variant]}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          variant === "danger" ? "bg-red-100 text-red-600" :
          variant === "warning" ? "bg-amber-100 text-amber-600" :
          variant === "info" ? "bg-blue-100 text-blue-600" :
          "bg-green-100 text-green-600"
        }`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${labelColors[variant]}`}>{label}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ACTION CARD — Clickable quick action
   ════════════════════════════════════════════ */
interface ActionCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  iconBg?: string;
}
export function ActionCard({ href, icon, label, iconBg = "bg-green-50 text-green-600" }: ActionCardProps) {
  const Link = require("next/link").default;
  return (
    <Link href={href} className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-green-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${iconBg} group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition">{label}</span>
    </Link>
  );
}

/* ════════════════════════════════════════════
   LIST ITEM — Activity / data row
   ════════════════════════════════════════════ */
interface ListItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}
export function ListItem({ icon, title, subtitle, trailing, onClick }: ListItemProps) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition ${onClick ? "cursor-pointer" : ""}`}>
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {trailing}
    </div>
  );
}

/* ════════════════════════════════════════════
   BADGE
   ════════════════════════════════════════════ */
interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}
export function Badge({ children, variant = "neutral" }: BadgeProps) {
  const styles = {
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    neutral: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${styles[variant]}`}>
      {children}
    </span>
  );
}
