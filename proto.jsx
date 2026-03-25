const { useState, useEffect } = React;

const CLASSES = [
  { id: 1, name: "No-Gi", coach: "Coach Dave", time: "12:00 PM", status: "live", focus: "Arm Drags & 2-on-1", enrolled: 18, capacity: 24 },
  { id: 2, name: "Kid's Class", coach: "Sarah M.", time: "3:30 PM", status: "ontime", focus: "Basic Takedowns", enrolled: 12, capacity: 20 },
  { id: 3, name: "Advanced Class", coach: "Sarah G.", time: "5:30 PM", status: "cancelled", focus: null, enrolled: 0, capacity: 0 },
  { id: 4, name: "Advanced No Gi", coach: "Coach Mike", time: "5:30 PM", status: "new", focus: "Guillotine Entries", enrolled: 9, capacity: 24 },
  { id: 5, name: "Wrestling", coach: "DK Mike", time: "8:30 PM", status: "ontime", focus: "Single Leg Setups", enrolled: 14, capacity: 24 },
];

const EARLIER = [
  { id: 6, name: "Yoga", coach: "Lisa R.", time: "6:00 AM", status: "done", focus: null, enrolled: 8, capacity: 15 },
  { id: 7, name: "Fundamentals", coach: "Coach K.", time: "7:30 AM", status: "done", focus: null, enrolled: 22, capacity: 24 },
];

const UPDATES = [
  { id: 1, type: "event", title: "BJJ Tournament", desc: "Sat. March 28th — Sign up at front desk or tap here", time: "2d ago", isNew: true, icon: "🏆" },
  { id: 2, type: "announcement", title: "New Sat. Open Mat", desc: "Coach D. adding Saturday morning open mat starting April 5th", time: "3d ago", isNew: true, icon: "📢" },
  { id: 3, type: "promo", title: "Gi Sale — 20% Off", desc: "Use code BJJFAM at checkout. Valid through March 31st", time: "5d ago", isNew: false, icon: "🏷️" },
];

const statusConfig = {
  live: { label: "LIVE", color: "#34d399", bg: "rgba(52,211,153,0.1)", glow: true },
  ontime: { label: "ON TIME", color: "#34d399", bg: "transparent", glow: false },
  cancelled: { label: "CANCELLED", color: "#f87171", bg: "rgba(248,113,113,0.06)", glow: false },
  new: { label: "NEW", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", glow: false },
  done: { label: "DONE", color: "#6b7280", bg: "transparent", glow: false },
};

function CapacityBar({ enrolled, capacity, status }) {
  if (status === "cancelled" || status === "done") return null;
  const pct = Math.round((enrolled / capacity) * 100);
  const barColor = pct > 85 ? "#f87171" : pct > 60 ? "#fbbf24" : "#34d399";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <div style={{
        flex: 1, height: 3, borderRadius: 2,
        background: "rgba(255,255,255,0.06)", overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 2,
          background: barColor, transition: "width 0.6s ease",
        }} />
      </div>
      <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {enrolled}/{capacity}
      </span>
    </div>
  );
}

function LiveWave() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 14 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: 2.5, borderRadius: 2, background: "#34d399",
          animation: `wave 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const c = statusConfig[status];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: c.color,
      background: c.bg, padding: "3px 8px", borderRadius: 20,
      border: `1px solid ${status === "cancelled" || status === "new" ? c.color + "40" : "transparent"}`,
      display: "inline-flex", alignItems: "center", gap: 6,
      backdropFilter: "blur(4px)",
    }}>
      {status === "live" && <LiveWave />}
      {c.label}
    </span>
  );
}

function ClassCard({ cls, expanded, onToggle, index }) {
  const c = statusConfig[cls.status];
  const isCancelled = cls.status === "cancelled";
  const isLive = cls.status === "live";
  const hasFocus = !!cls.focus;

  return (
    <div
      onClick={() => hasFocus && onToggle(cls.id)}
      style={{
        background: isLive
          ? "linear-gradient(135deg, rgba(6,78,59,0.5) 0%, rgba(6,78,59,0.2) 100%)"
          : "rgba(255,255,255,0.02)",
        borderRadius: 16, padding: "16px 18px",
        cursor: hasFocus ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        position: "relative", overflow: "hidden",
        border: `1px solid ${isLive ? "rgba(52,211,153,0.2)" : isCancelled ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.04)"}`,
        animation: `fade-up 0.4s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* Cancelled diagonal stripe overlay */}
      {isCancelled && (
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(135deg, #f87171 0px, #f87171 1px, transparent 1px, transparent 8px)",
        }} />
      )}
      {/* Live shimmer */}
      {isLive && (
        <div style={{
          position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%",
          background: "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.04) 50%, transparent 100%)",
          animation: "shimmer 3s ease-in-out infinite", pointerEvents: "none",
        }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
            <span style={{
              fontSize: 22, fontWeight: 300, color: isCancelled ? "#6b7280" : isLive ? "#34d399" : "#e5e7eb",
              fontVariantNumeric: "tabular-nums", letterSpacing: -0.5,
              textDecoration: isCancelled ? "line-through" : "none",
              textDecorationColor: "rgba(248,113,113,0.5)",
              textDecorationThickness: "1.5px",
            }}>
              {cls.time}
            </span>
            <span style={{
              fontSize: 16, fontWeight: 600,
              color: isCancelled ? "#6b7280" : "#fff",
              textDecoration: isCancelled ? "line-through" : "none",
              textDecorationColor: "rgba(248,113,113,0.5)",
              textDecorationThickness: "1.5px",
            }}>
              {cls.name}
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{cls.coach}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginTop: 4 }}>
          <StatusBadge status={cls.status} />
          {hasFocus && (
            <svg width="16" height="16" viewBox="0 0 16 16" style={{
              transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              opacity: 0.3,
            }}>
              <path d="M6 4l4 4-4 4" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      <CapacityBar enrolled={cls.enrolled} capacity={cls.capacity} status={cls.status} />

      {/* Expanded focus */}
      {expanded && cls.focus && (
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          animation: "fade-up 0.2s ease-out",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(163,230,53,0.08)", padding: "8px 14px",
            borderRadius: 10, border: "1px solid rgba(163,230,53,0.12)",
          }}>
            <span style={{ fontSize: 11, color: "#a3e635", fontWeight: 500, opacity: 0.7 }}>Today's Focus</span>
            <span style={{ width: 1, height: 12, background: "rgba(163,230,53,0.2)" }} />
            <span style={{ fontSize: 13, color: "#d9f99d", fontWeight: 600 }}>{cls.focus}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function UpdateCard({ update, index }) {
  const typeColors = {
    event: { accent: "#a78bfa", bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.12)" },
    announcement: { accent: "#60a5fa", bg: "rgba(96,165,250,0.06)", border: "rgba(96,165,250,0.12)" },
    promo: { accent: "#fb923c", bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.12)" },
  };
  const tc = typeColors[update.type] || typeColors.announcement;

  return (
    <div style={{
      background: tc.bg, borderRadius: 16, padding: "18px",
      border: `1px solid ${tc.border}`,
      position: "relative", overflow: "hidden",
      animation: `fade-up 0.4s ease-out ${index * 0.08}s both`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 14, flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
            border: `1px solid ${tc.border}`,
          }}>
            {update.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                color: tc.accent,
              }}>
                {update.type}
              </span>
              <span style={{ fontSize: 10, color: "#6b7280" }}>·</span>
              <span style={{ fontSize: 10, color: "#6b7280" }}>{update.time}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6", marginBottom: 4, lineHeight: 1.3 }}>
              {update.title}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
              {update.desc}
            </div>
          </div>
        </div>
        {update.isNew && (
          <span style={{
            fontSize: 8, fontWeight: 800, letterSpacing: 1.5,
            color: "#fbbf24", background: "rgba(251,191,36,0.15)",
            padding: "3px 8px", borderRadius: 20, flexShrink: 0, marginLeft: 8,
            border: "1px solid rgba(251,191,36,0.2)",
          }}>NEW</span>
        )}
      </div>
    </div>
  );
}

function TimelineDot({ active }) {
  return (
    <div style={{
      width: active ? 10 : 6, height: active ? 10 : 6,
      borderRadius: "50%",
      background: active ? "#34d399" : "rgba(255,255,255,0.15)",
      boxShadow: active ? "0 0 8px rgba(52,211,153,0.4)" : "none",
      transition: "all 0.3s",
      flexShrink: 0,
    }} />
  );
}

function GymFeed() {
  const [tab, setTab] = useState("schedule");
  const [expanded, setExpanded] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const unreadCount = UPDATES.filter(u => u.isNew).length;
  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div style={{
      maxWidth: 400, margin: "0 auto", minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#e5e7eb", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 400, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        padding: "24px 20px 0", display: "flex", justifyContent: "space-between",
        alignItems: "center", position: "relative", zIndex: 1,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
            color: "#6b7280", marginBottom: 4,
          }}>
            Dashboard
          </div>
          <div style={{
            fontSize: 26, fontWeight: 800, letterSpacing: -1, color: "#fff",
            lineHeight: 1,
          }}>
            BSS Gym
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(52,211,153,0.08)", padding: "5px 10px", borderRadius: 20,
            border: "1px solid rgba(52,211,153,0.12)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: "#34d399",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: -3,
                borderRadius: "50%", border: "1px solid rgba(52,211,153,0.3)",
                animation: "pulse-ring 2s ease-out infinite",
              }} />
            </div>
            <span style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>Live</span>
          </div>
          <span style={{ fontSize: 10, color: "#4b5563" }}>8m ago</span>
        </div>
      </div>

      {/* Alert Banner */}
      {!alertDismissed && (
        <div style={{
          margin: "18px 16px 0", padding: "14px 16px",
          background: "rgba(127,29,29,0.2)",
          border: "1px solid rgba(248,113,113,0.15)", borderRadius: 16,
          animation: "slide-in 0.4s cubic-bezier(0.16,1,0.3,1)",
          position: "relative", overflow: "hidden", backdropFilter: "blur(8px)",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, rgba(248,113,113,0.5), transparent)",
          }} />
          <div onClick={() => setAlertDismissed(true)} style={{
            position: "absolute", top: 12, right: 14, cursor: "pointer",
            color: "#6b7280", fontSize: 14, width: 22, height: 22, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.04)", transition: "all 0.2s",
          }}>×</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(248,113,113,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0, marginTop: 2,
              border: "1px solid rgba(248,113,113,0.15)",
            }}>⚠</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", marginBottom: 4 }}>
                2 evening classes cancelled
              </div>
              <div style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.6 }}>
                Coach out sick · Open Mat with Dave at 6:30
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6, fontStyle: "italic" }}>
                Confirmed by Coach K. · 12 min ago
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        display: "flex", margin: "18px 16px 0", gap: 0,
        background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 4,
        border: "1px solid rgba(255,255,255,0.04)",
      }}>
        {["schedule", "updates"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "11px 0", border: "none", borderRadius: 11,
              background: tab === t
                ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)"
                : "transparent",
              color: tab === t ? "#fff" : "#6b7280",
              fontSize: 13, fontWeight: tab === t ? 700 : 500, cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              fontFamily: "inherit", letterSpacing: 0.3,
              boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
              position: "relative",
            }}
          >
            {t === "updates" ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Updates
                {unreadCount > 0 && (
                  <span style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    color: "#fff", fontSize: 9, fontWeight: 800,
                    minWidth: 18, height: 18, borderRadius: 10,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0 5px",
                    boxShadow: "0 2px 6px rgba(239,68,68,0.4)",
                  }}>{unreadCount}</span>
                )}
              </span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                Schedule
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 40px", position: "relative" }}>
        {tab === "schedule" ? (
          <div key="schedule">
            {/* Upcoming */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 12, marginTop: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#34d399" }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#9ca3af",
                }}>Upcoming</span>
              </div>
              <span style={{ fontSize: 10, color: "#4b5563" }}>{CLASSES.length} classes</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CLASSES.map((cls, i) => (
                <ClassCard key={cls.id} cls={cls} expanded={expanded === cls.id} onToggle={toggleExpand} index={i} />
              ))}
            </div>

            {/* Earlier Today */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 12, marginTop: 28,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#4b5563" }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#6b7280",
                }}>Earlier Today</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EARLIER.map((cls, i) => (
                <ClassCard key={cls.id} cls={cls} expanded={expanded === cls.id} onToggle={toggleExpand} index={i + CLASSES.length} />
              ))}
            </div>

            {/* Tap hint */}
            <div style={{
              textAlign: "center", marginTop: 24, padding: "14px 0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: 0.25 }}>
                <path d="M7 1v12M4 8l3 5 3-5" stroke="#9ca3af" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 11, color: "#4b5563" }}>
                Tap a class to see today's focus
              </span>
            </div>
          </div>
        ) : (
          <div key="updates">
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 12, marginTop: 4,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#a78bfa" }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#9ca3af",
                }}>Latest</span>
              </div>
              {unreadCount > 0 && (
                <span style={{ fontSize: 10, color: "#6b7280" }}>{unreadCount} new</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {UPDATES.map((u, i) => <UpdateCard key={u.id} update={u} index={i} />)}
            </div>

            <div style={{
              textAlign: "center", marginTop: 28, padding: "16px 0",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: "#4b5563" }}>
                You're all caught up
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom safe area */}
      <div style={{ height: 20 }} />
    </div>
  );
}
