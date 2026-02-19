"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Flame,
  Clock,
  Target,
  Award,
  TrendingUp,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

// =====================
// DATA (swap later)
// =====================
type KPI = {
  label: string;
  value: string;
  Icon: LucideIcon;
  iconBg: string;   // tailwind class
  iconColor: string; // tailwind class
};

const kpis: KPI[] = [
  {
    label: "Study Streak",
    value: "7 days",
    Icon: Flame,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label: "Avg. Hours/Day",
    value: "4.2h",
    Icon: Clock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Sessions Completed",
    value: "156",
    Icon: Target,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Goals Achieved",
    value: "12/18",
    Icon: Award,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const weeklyStudy = [
  { week: "Week 1", actual: 18, target: 24 },
  { week: "Week 2", actual: 22, target: 24 },
  { week: "Week 3", actual: 24, target: 24 },
  { week: "Week 4", actual: 26, target: 24 },
  { week: "Week 5", actual: 23, target: 24 },
  { week: "Week 6", actual: 28, target: 24 },
];

const dailyConsistency = [
  { day: "Mon", hours: 4.0 },
  { day: "Tue", hours: 5.0 },
  { day: "Wed", hours: 3.0 },
  { day: "Thu", hours: 4.5 },
  { day: "Fri", hours: 4.0 },
  { day: "Sat", hours: 3.6 },
  { day: "Sun", hours: 2.0 },
];

const sessionType = [
  { name: "New Material", value: 45, color: "#3B82F6" }, // blue
  { name: "Review", value: 30, color: "#8B5CF6" },       // purple
  { name: "Practice", value: 25, color: "#10B981" },     // green
];

const timeByCourse = [
  { name: "Data Structures", value: 24, color: "#3B82F6" }, // blue
  { name: "Calculus II", value: 16, color: "#16A34A" },     // green-600
  { name: "Web Development", value: 20, color: "#7C3AED" }, // purple-600
  { name: "Database Systems", value: 12, color: "#F97316" },// orange-500
  { name: "Linear Algebra", value: 18, color: "#DC2626" },  // red-600
  { name: "Operating Systems", value: 10, color: "#4F46E5" },// indigo-600
];

const courseProgress = [
  { name: "Data Structures", studied: "24h studied", pct: 45, color: "bg-blue-500" },
  { name: "Calculus II", studied: "16h studied", pct: 62, color: "bg-green-600" },
  { name: "Web Development", studied: "20h studied", pct: 78, color: "bg-purple-600" },
  { name: "Database Systems", studied: "12h studied", pct: 38, color: "bg-orange-500" },
  { name: "Linear Algebra", studied: "18h studied", pct: 55, color: "bg-red-600" },
  { name: "Operating Systems", studied: "10h studied", pct: 30, color: "bg-indigo-600" },
];

// =====================
// UI helpers
// =====================
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {children}
    </div>
  );
}

function CardHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-6 pb-2">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {right}
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-2">{children}</div>;
}

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #E5E7EB",
      boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    },
    labelStyle: { color: "#111827", fontWeight: 700 },
  } as const;
}

function ProgressBar({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${colorClass} transition-all`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  iconBg,
  iconColor,
}: KPI) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function InsightCard({
  Icon,
  title,
  message,
  tone,
}: {
  Icon: LucideIcon;
  title: string;
  message: string;
  tone: "blue" | "orange" | "green";
}) {
  const tones = {
    blue: {
      wrap: "bg-blue-50 border-blue-200",
      iconWrap: "bg-blue-100",
      icon: "text-blue-600",
      title: "text-blue-900",
      text: "text-blue-800",
    },
    orange: {
      wrap: "bg-orange-50 border-orange-200",
      iconWrap: "bg-orange-100",
      icon: "text-orange-600",
      title: "text-orange-900",
      text: "text-orange-800",
    },
    green: {
      wrap: "bg-green-50 border-green-200",
      iconWrap: "bg-green-100",
      icon: "text-green-600",
      title: "text-green-900",
      text: "text-green-800",
    },
  }[tone];

  return (
    <div className={`border rounded-xl p-6 ${tones.wrap}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${tones.iconWrap} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${tones.icon}`} />
        </div>
        <div>
          <h4 className={`font-semibold mb-1 ${tones.title}`}>{title}</h4>
          <p className={`text-sm ${tones.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}

// =====================
// PAGE (same wrapper as Courses)
// =====================
export default function AnalyticsPageView() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header (same pattern as Courses page) */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">Track your progress and study habits</p>
        </div>

        {/* KPI Section (match screenshot layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {kpis.map((k) => (
            <StatCard key={k.label} {...k} />
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader
              title="Weekly Study Hours"
              right={
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15% this week
                </span>
              }
            />
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStudy} barCategoryGap={18}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip {...tooltipStyle()} />
                    <Bar dataKey="actual" fill="#3B82F6" radius={[10, 10, 0, 0]} name="Actual Hours" />
                    <Bar dataKey="target" fill="#D1D5DB" radius={[10, 10, 0, 0]} name="Target Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-gray-700 font-medium">Actual Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded" />
                  <span className="text-gray-400">Target Hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Daily Consistency" />
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyConsistency}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip {...tooltipStyle()} />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#8B5CF6" }}
                      activeDot={{ r: 7 }}
                      name="Study Hours"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader title="Session Type Distribution" />
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sessionType} dataKey="value" nameKey="name" outerRadius={110} paddingAngle={2}>
                      {sessionType.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-8 w-full max-w-md mx-auto mt-2">
                {sessionType.map((s) => (
                  <div key={s.name} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                      <p className="text-xs text-gray-600">{s.name}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Time Distribution by Course" />
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeByCourse}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                    >
                      {timeByCourse.map((c) => (
                        <Cell key={c.name} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Overview (fix colors) */}
        <Card>
          <CardHeader title="Course Progress Overview" />
          <CardContent>
            <div className="space-y-5">
              {courseProgress.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className="text-sm font-medium text-gray-900">{c.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{c.studied}</span>
                      <span className="text-sm font-bold text-gray-900">{c.pct}%</span>
                    </div>
                  </div>

                  <ProgressBar value={c.pct} colorClass={c.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights (fix icon + tones) */}
        <div className="grid grid-cols-3 xl:grid-cols-3 gap-6 mt-8">
          <InsightCard
            Icon={Sparkles}
            tone="blue"
            title="Best Performance"
            message="Web Development showing highest progress at 78% completion. Keep up the great work!"
          />
          <InsightCard
            Icon={AlertCircle}
            tone="orange"
            title="Needs Attention"
            message="Operating Systems needs more focus — only 30% complete with deadline approaching."
          />
          <InsightCard
            Icon={CheckCircle2}
            tone="green"
            title="Streak Bonus"
            message="7-day study streak! You’re building excellent consistency. Aim for 14 days next!"
          />
        </div>
      </div>
    </div>
  );
}
