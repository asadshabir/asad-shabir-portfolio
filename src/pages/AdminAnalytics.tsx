import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Eye,
  Mail,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Resume,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import SeoMeta from "@/components/seo/SeoMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAnalyticsSummary,
  exportSubscribersCsv,
  type AnalyticsSummary,
  type RecentEvent,
} from "@/lib/analyticsAdminService";

// ── Metric card ──────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ label, value, icon, color }: MetricCardProps) => (
  <div className="p-5 rounded-xl bg-card border border-border/50 flex items-start gap-4">
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: `hsl(${color})`, color: `hsl(${color})` }}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Metric mapping ──────────────────────────────────────────

const METRIC_CONFIGS: {
  key: keyof Omit<AnalyticsSummary, "last_updated" | "total_events">;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "resume_downloads",
    label: "Resume Downloads",
    icon: <Resume className="w-5 h-5" />,
    color: "var(--primary)",
  },
  {
    key: "contact_submissions",
    label: "Contact Submissions",
    icon: <Mail className="w-5 h-5" />,
    color: "var(--emerald)",
  },
  {
    key: "chatbot_sessions",
    label: "Chatbot Sessions",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "var(--accent)",
  },
  {
    key: "cta_clicks",
    label: "CTA Clicks",
    icon: <MousePointerClick className="w-5 h-5" />,
    color: "224 46% 3%",
  },
  {
    key: "estimator_uses",
    label: "Estimator Uses",
    icon: <Sparkles className="w-5 h-5" />,
    color: "var(--primary)",
  },
  {
    key: "reviewer_uses",
    label: "Resume Reviews",
    icon: <UserCheck className="w-5 h-5" />,
    color: "var(--emerald)",
  },
  {
    key: "email_captures",
    label: "Email Captures",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "var(--accent)",
  },
  {
    key: "subscriber_count",
    label: "Total Subscribers",
    icon: <Mail className="w-5 h-5" />,
    color: "var(--emerald)",
  },
];

// ── Event type label ─────────────────────────────────────────

function formatEventType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Password gate ───────────────────────────────────────────

function PasswordGate({
  onUnlock,
  loading,
  error,
}: {
  onUnlock: (pw: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 rounded-2xl bg-card border border-border/50 text-center"
      >
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-xl font-bold mb-1">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your admin password to access portfolio metrics.
        </p>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && password && onUnlock(password)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background/60 outline-none focus:border-primary/50 transition-colors text-sm"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <button
            onClick={() => password && onUnlock(password)}
            disabled={!password || loading}
            className="w-full py-3 rounded-xl font-semibold premium-glass-button premium-glass-button--primary disabled:opacity-50 transition-all text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Dashboard"
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-5">
          Protected by ANALYTICS_PASSWORD
        </p>
      </motion.div>
    </div>
  );
}

// ── Main dashboard ───────────────────────────────────────────

function AnalyticsDashboard({
  data,
  password,
}: {
  data: { data: AnalyticsSummary; recent_events: RecentEvent[] };
  password: string;
}) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-none">Analytics</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updated{" "}
                {data.data.last_updated
                  ? new Date(data.data.last_updated).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSubscribersCsv(password)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 text-xs font-medium hover:bg-muted/50 transition-colors"
              title="Export subscribers as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <span className="text-xs text-muted-foreground border border-border/40 px-3 py-2 rounded-lg flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8">
        {/* Metric cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {METRIC_CONFIGS.map((cfg, i) => (
            <motion.div
              key={cfg.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MetricCard
                label={cfg.label}
                value={data.data[cfg.key]}
                icon={
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: `hsl(${cfg.color} / 0.12)`,
                      color: `hsl(${cfg.color})`,
                    }}
                  >
                    {cfg.icon}
                  </div>
                }
                color={cfg.color}
              />
            </motion.div>
          ))}
        </div>

        {/* Recent events table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Events</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              Last {Math.min(data.recent_events.length, 50)} events
            </span>
          </div>

          {data.recent_events.length === 0 ? (
            <div className="p-12 rounded-xl border border-dashed border-border/40 text-center">
              <p className="text-muted-foreground text-sm">
                No events recorded yet. Events appear here as visitors interact with your portfolio.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-32">Event</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-40">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent_events.map((event, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 text-foreground/80">
                          {formatEventType(event.event_type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {event.metadata
                          ? Object.entries(event.metadata)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground tabular-nums">
                        {formatTimestamp(event.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Last updated footer note */}
        <p className="text-xs text-muted-foreground text-center mt-8">
          Analytics are stored in-memory and reset on server cold starts. Data is privacy-first — no IP addresses or personal data beyond voluntarily-submitted emails.
        </p>
      </div>
    </div>
  );
}

// ── Page component ───────────────────────────────────────────

export default function AdminAnalytics() {
  const [password, setPassword] = useState<string | null>(
    // Try to persist password in sessionStorage so re-navigating within the tab doesn't require re-auth
    (() => {
      try {
        return sessionStorage.getItem("analytics_password");
      } catch {
        return null;
      }
    })()
  );
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [data, setData] = useState<{
    data: AnalyticsSummary;
    recent_events: RecentEvent[];
  } | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load data if we already have a password from a prior auth in this session
  useEffect(() => {
    if (password && !data) {
      loadData(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData(pw: string) {
    setLoading(true);
    setFetchError(null);
    setAuthError(null);
    try {
      const result = await fetchAnalyticsSummary(pw);
      setData(result);
      // Persist password for this session
      try {
        sessionStorage.setItem("analytics_password", pw);
      } catch {}
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load analytics.";
      if (msg.toLowerCase().includes("401") || msg.toLowerCase().includes("invalid")) {
        setAuthError(msg);
        setPassword(null);
        try {
          sessionStorage.removeItem("analytics_password");
        } catch {}
      } else {
        setFetchError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleUnlock(pw: string) {
    loadData(pw);
  }

  return (
    <>
      <SeoMeta
        title="Analytics Dashboard — Asad Shabir"
        description="Portfolio lead analytics dashboard"
        canonicalUrl="/admin/analytics"
      />
      {!password || loading ? (
        <PasswordGate
          onUnlock={handleUnlock}
          loading={loading}
          error={authError || fetchError}
        />
      ) : data ? (
        <AnalyticsDashboard data={data} password={password} />
      ) : null}
    </>
  );
}
