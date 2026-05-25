import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Users, TrendingUp, Award, Clock, FileText, Sparkles } from "lucide-react";
import { FluencyHeatmap } from "./FluencyHeatmap";

interface TeacherDashboardProps {
  onBack: () => void;
}

interface StudentData {
  id: number;
  name: string;
  levelsCompleted: number;
  totalLevels: number;
  accuracy: number;
  lastActive: string;
  totalSessions: number;
  avgSessionTime: number;
}

export function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"progress" | "heatmap">("heatmap");

  const students: StudentData[] = [
    { id: 1, name: "Juan Cruz", levelsCompleted: 8, totalLevels: 23, accuracy: 82, lastActive: "Today", totalSessions: 12, avgSessionTime: 15 },
    { id: 2, name: "Maria Santos", levelsCompleted: 12, totalLevels: 23, accuracy: 91, lastActive: "Today", totalSessions: 15, avgSessionTime: 18 },
    { id: 3, name: "Pedro Garcia", levelsCompleted: 5, totalLevels: 23, accuracy: 68, lastActive: "Yesterday", totalSessions: 8, avgSessionTime: 10 },
    { id: 4, name: "Ana Reyes", levelsCompleted: 10, totalLevels: 23, accuracy: 85, lastActive: "Today", totalSessions: 14, avgSessionTime: 16 },
  ];

  const classStats = {
    totalStudents: students.length,
    avgAccuracy: Math.round(students.reduce((s, st) => s + st.accuracy, 0) / students.length),
    avgCompletion: Math.round(
      students.reduce((s, st) => s + (st.levelsCompleted / st.totalLevels) * 100, 0) / students.length
    ),
    activeToday: students.filter((s) => s.lastActive === "Today").length,
  };

  const stats = [
    { label: "Students", value: classStats.totalStudents, icon: Users, tint: "#EEF2FF", color: "#4F46E5" },
    { label: "Avg Accuracy", value: `${classStats.avgAccuracy}%`, icon: TrendingUp, tint: "#D1FAE5", color: "#10B981" },
    { label: "Avg Completion", value: `${classStats.avgCompletion}%`, icon: Award, tint: "#FCE7F3", color: "#DB2777" },
    { label: "Active Today", value: classStats.activeToday, icon: Clock, tint: "#FFF7ED", color: "#F59E0B" },
  ];

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A91A3]">
              <Users className="w-3.5 h-3.5" />
              Teacher Dashboard
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Grade 1 — Section A</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">Class Overview</h1>
              <p className="text-[#4B5266]">
                {classStats.activeToday} of {classStats.totalStudents} students active today
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-[#1F243014]"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: s.tint }}
                    >
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-[#8A91A3]">{s.label}</span>
                  </div>
                  <p className="text-3xl text-[#1F2430] tracking-tight">{s.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Segmented tabs */}
          <div className="mb-6 inline-flex p-1 bg-white border border-[#1F243014] rounded-xl">
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors ${
                activeTab === "heatmap" ? "bg-[#EEF2FF] text-[#4F46E5]" : "text-[#8A91A3] hover:text-[#4B5266]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Fluency Heatmap
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors ${
                activeTab === "progress" ? "bg-[#EEF2FF] text-[#4F46E5]" : "text-[#8A91A3] hover:text-[#4B5266]"
              }`}
            >
              <FileText className="w-4 h-4" />
              Student Progress
            </button>
          </div>

          {activeTab === "heatmap" && <FluencyHeatmap />}

          {activeTab === "progress" && (
            <div className="bg-white rounded-2xl p-6 border border-[#1F243014]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg text-[#1F2430]">Student Progress Report</h2>
                <span className="text-xs uppercase tracking-wider text-[#8A91A3]">
                  {students.length} students
                </span>
              </div>

              <ul className="divide-y divide-[#1F243014]">
                {students.map((student, index) => {
                  const pct = Math.round((student.levelsCompleted / student.totalLevels) * 100);
                  const expanded = selectedStudent === student.id;
                  const accTone =
                    student.accuracy >= 80
                      ? { color: "#10B981", tint: "#D1FAE5", label: "On track" }
                      : student.accuracy >= 70
                      ? { color: "#F59E0B", tint: "#FFF7ED", label: "Monitor" }
                      : { color: "#DC2626", tint: "#FEE2E2", label: "Needs support" };
                  return (
                    <motion.li
                      key={student.id}
                      initial={{ x: -8, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedStudent(expanded ? null : student.id)}
                      className="py-4 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#1F243014] flex items-center justify-center text-[#1F2430]">
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#1F2430] truncate">{student.name}</p>
                            <p className="text-xs text-[#8A91A3]">{student.lastActive} · {student.totalSessions} sessions</p>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm">
                          <div className="text-right leading-tight">
                            <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Progress</p>
                            <p className="text-[#1F2430]">
                              {student.levelsCompleted}/{student.totalLevels}
                            </p>
                          </div>
                          <div className="text-right leading-tight">
                            <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Accuracy</p>
                            <p className="text-[#1F2430]">{student.accuracy}%</p>
                          </div>
                        </div>

                        <span
                          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ background: accTone.tint, color: accTone.color }}
                        >
                          {accTone.label}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1 bg-[#F2EEE6] rounded-full overflow-hidden">
                          <div
                            className="h-1 bg-[#4F46E5] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#8A91A3] w-9 text-right">{pct}%</span>
                      </div>

                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#1F243014]">
                            <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Avg session</p>
                            <p className="text-[#1F2430] mt-0.5">{student.avgSessionTime} minutes</p>
                          </div>
                          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#1F243014]">
                            <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Engagement</p>
                            <p className="text-[#1F2430] mt-0.5">
                              {student.accuracy >= 80 ? "High" : "Moderate"}
                            </p>
                          </div>
                          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#1F243014] md:col-span-1 col-span-1">
                            <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Recommendation</p>
                            <p className="text-[#1F2430] mt-0.5 text-sm">
                              {student.accuracy < 70
                                ? "Add phonemic awareness practice."
                                : student.accuracy >= 80
                                ? "Ready for advanced challenges."
                                : "Continue current pace."}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
