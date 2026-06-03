import * as React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Check,
  X,
  Edit3,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { usePersona } from "@/lib/persona-context";
import { PERSONAS, KPIS, BRIEFING, SUGGESTED } from "@/lib/mazda-mock";
import { PageHeader } from "@/components/MazdaAppShell";
import { useMazdaChat } from "@/lib/use-mazda-chat";

const ICONS = { lead: Mail, alert: AlertTriangle, claim: Wrench, score: TrendingUp };

const SEED_PROMPT: Record<string, string> = {
  field: "Show me CX-90 PHEV digital-retail leads in SoCal aged >48h, joined to households with an active MFS lease maturing inside 90 days.",
  agent: "Summarize the top owner-support cases I should resolve first this morning, given Recall C2451 and the CV subscription Stripe failures.",
  dealer: "Which of today's hot DR leads should I call first, and draft an SMS for the top one referencing their household garage.",
  partner: "Brief me on the 2024 CX-50 P0420 trend and the next move for the at-risk CV subscription cohort.",
};

export default function MazdaHome() {
  const { persona, setReasoningOpen } = usePersona();
  const p = PERSONAS[persona];
  const { messages, send, streaming, error } = useMazdaChat(persona);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  React.useEffect(() => { if (error) toast.error(error); }, [error]);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    send(value);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow={p.org}
        title={`Good morning, ${p.name.split(" ")[0]}.`}
        description={`${p.agentName} pulled overnight signals from Data Cloud, Sales, Service, and connected vehicles. Here's what needs your attention.`}
        actions={
          <button
            onClick={() => setReasoningOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded border hairline text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Show reasoning
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPIS[persona].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded border hairline bg-card p-4"
          >
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="text-3xl mt-2">{k.value}</div>
            <div className={`text-xs mt-1 ${k.positive ? "text-success" : "text-warning"}`}>{k.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <SectionTitle eyebrow="Morning briefing" title="What changed overnight" />
            <div className="space-y-3">
              {BRIEFING[persona].map((item, i) => {
                const Icon = ICONS[item.icon];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded border hairline bg-card p-5 flex gap-4 hover:border-primary transition-colors"
                  >
                    <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.title}</div>
                      <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                      <div className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wider">Source: {item.source}</div>
                    </div>
                    <button
                      onClick={() => submit(`About this briefing item — "${item.title}". ${item.detail} What's the next best action?`)}
                      className="self-start text-[11px] text-primary hover:underline whitespace-nowrap"
                    >
                      Ask Atlas →
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Conversation" title={`Ask ${p.agentName}`} />
            <div className="rounded border hairline bg-card flex flex-col" style={{ minHeight: 380 }}>
              <div ref={scrollRef} className="flex-1 overflow-auto p-5 space-y-4 max-h-[520px]">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Try a starter prompt, or ask anything grounded in the briefing above.</p>
                    <button
                      onClick={() => submit(SEED_PROMPT[persona])}
                      className="text-left w-full rounded border hairline bg-secondary/40 p-3 text-sm hover:border-primary transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-primary block mb-1">Suggested prompt</span>
                      {SEED_PROMPT[persona]}
                    </button>
                  </div>
                )}
                {messages.map((m, i) => (
                  <Bubble key={i} role={m.role}>
                    {m.content || (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Atlas is thinking…
                      </span>
                    )}
                  </Bubble>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t hairline p-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
                  }}
                  disabled={streaming}
                  placeholder="Reply or ask another question…"
                  className="flex-1 h-10 rounded bg-secondary border hairline px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                />
                <button
                  onClick={() => submit()}
                  disabled={streaming || !input.trim()}
                  className="h-10 px-3 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {streaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Send <Send className="h-3.5 w-3.5" /></>}
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section>
            <SectionTitle eyebrow="Atlas suggests" title="Approve, modify, or dismiss" />
            <div className="space-y-3">
              {SUGGESTED[persona].map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded border hairline bg-card p-4"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">{s.title}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{s.rationale}</p>
                  <div className="mt-2 inline-block text-[10px] uppercase tracking-wider text-muted-foreground border hairline rounded px-1.5 py-0.5">{s.effort}</div>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => toast.success("Action approved", { description: `${s.title} — logged to Auto Cloud audit trail.` })}
                      className="flex-1 h-7 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-medium flex items-center justify-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </button>
                    <button
                      onClick={() => submit(`Refine this suggested action and propose an alternative: ${s.title}. Rationale: ${s.rationale}`)}
                      title="Modify with Atlas"
                      className="h-7 w-7 rounded border hairline text-muted-foreground hover:text-foreground flex items-center justify-center"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => toast("Suggestion dismissed", { description: s.title })}
                      className="h-7 w-7 rounded border hairline text-muted-foreground hover:text-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Jump into" title="Deep-dive consoles" />
            <div className="grid grid-cols-1 gap-2">
              <ConsoleLink to="/leads" title="Lead → Sale Pipeline" desc="DR routing (MazdaUSA / Cox / CarNow / AutoFi), Einstein scores, SLA timers" />
              <ConsoleLink to="/vehicle" title="Vehicle Console" desc="VIN, MyMazda telemetry, CV subscription, open recalls" />
              <ConsoleLink to="/warranty" title="Warranty / Owner Case" desc="MGWS-matched claim drafted by Atlas" />
              <ConsoleLink to="/dealer-scorecard" title="Dealer Performance" desc="DR acceptance, CSI, recall completion, visit prep" />
              <ConsoleLink to="/household" title="Customer 360 / Household" desc="Key-ring identity, multi-VIN garage, trade-cycle propensity" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
      <h2 className="text-xl mt-1">{title}</h2>
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded rounded-br-sm bg-secondary px-4 py-2.5 text-sm">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="h-7 w-7 rounded bg-gradient-soul flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="max-w-[85%] rounded rounded-tl-sm bg-secondary border hairline px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function ConsoleLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded border hairline bg-card p-3 flex items-center gap-3 hover:border-primary transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}