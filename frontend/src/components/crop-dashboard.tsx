"use client";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleAlert,
  ChevronDown,
  Clock3,
  CloudUpload,
  FileImage,
  Flower2,
  HeartPulse,
  Leaf,
  LoaderCircle,
  LogOut,
  Menu,
  MessageSquareText,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Upload,
  Video,
  Wheat,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";

import { useAuth } from "@/components/auth-provider";
import { AiAgronomistChat } from "@/components/ai-agronomist-chat";
import { DiseaseGuidanceCard } from "@/components/disease-guidance-card";
import { ExpertConsultationModal } from "@/components/expert-consultation-modal";
import { VideoCameraScanner } from "@/components/video-camera-scanner";
import { apiRequest, type Diagnosis, type Disease, type Scan } from "@/lib/api";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

type Section = "overview" | "diagnose" | "history" | "library";

const sectionDetails: Record<
  Section,
  { eyebrow: string; title: string; subtitle: string }
> = {
  overview: {
    eyebrow: "YOUR FARM, AT A GLANCE",
    title: "A clearer view of your crops.",
    subtitle: "Catch changes early. Make the next growing decision with confidence.",
  },
  diagnose: {
    eyebrow: "AI-POWERED CROP CARE",
    title: "Take a closer look.",
    subtitle: "Upload a clear leaf photo for an honest, explainable assessment.",
  },
  history: {
    eyebrow: "YOUR FIELD NOTES",
    title: "Every scan, in one place.",
    subtitle: "Review your crop checks and revisit the original leaf images.",
  },
  library: {
    eyebrow: "KNOW WHAT TO LOOK FOR",
    title: "The field guide.",
    subtitle: "Practical, locally mindful information for the conditions in your crop.",
  },
};

function prettyDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function initialName(userName: string | undefined, email: string | undefined): string {
  return userName?.trim().split(/\s+/)[0] || email?.split("@")[0] || "grower";
}

function ConfigScreen() {
  return (
    <main className="config-screen">
      <section className="config-card">
        <span className="brand-mark"><Sprout size={24} /></span>
        <span className="eyebrow">CONFIGURATION REQUIRED</span>
        <h1>Connect your Supabase project.</h1>
        <p>
          Add your Supabase project URL and public publishable key to{" "}
          <code>frontend/.env.local</code>.
        </p>
      </section>
    </main>
  );
}

function AuthScreen({ client }: { client: ReturnType<typeof getSupabase> | null }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInMethod, setSignInMethod] = useState<"password" | "email-code">("email-code");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    let supabase = client;
    if (!supabase && supabaseConfigured()) {
      try {
        supabase = getSupabase();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Supabase is not configured.");
        return;
      }
    }
    if (!supabase) {
      setError("Supabase client is not ready. Please check configuration.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        if (signInMethod === "password") {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (signInError) throw signInError;
        } else if (otpSent) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: otp.trim(),
            type: "email",
          });
          if (verifyError) throw verifyError;
        } else {
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: email.trim(),
          });
          if (otpError) throw otpError;
          setOtpSent(true);
          setMessage(`A sign-in code was sent to ${email.trim()}.`);
        }
      } else {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim() || undefined,
            },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage(
            "Account created! Check your email to confirm your account, then sign in.",
          );
          setMode("signin");
        }
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Authentication failed. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function resendOtp() {
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const supabase = client ?? getSupabase();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });
      if (otpError) throw otpError;
      setOtp("");
      setMessage(`A new sign-in code was sent to ${email.trim()}.`);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not send another code. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-story">
        <div className="brand brand-light">
          <span className="brand-mark"><Sprout size={23} /></span>
          <span>verdant<span className="brand-dot">.</span></span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">AI CROP HEALTH MONITOR</span>
          <h1>Care for every leaf. <em>Grow with certainty.</em></h1>
          <p>
            Instant plant disease identification, tailored treatment guidance,
            and private field scan history powered by Supabase and neural vision.
          </p>
        </div>
        <div className="story-footer">
          <span className="story-leaf"><Leaf size={16} /></span>
          <span>Email one-time codes · Private field history · AI diagnostics</span>
        </div>
        <div className="story-orb story-orb-one" />
        <div className="story-orb story-orb-two" />
      </aside>

      <main className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="brand-mark"><Sprout size={22} /></span>
            <span>verdant<span className="brand-dot">.</span></span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">
              {mode === "signin"
                ? signInMethod === "email-code" ? "SIGN IN WITH EMAIL CODE" : "WELCOME BACK TO YOUR FIELD"
                : "START GROWING WITH VERDANT"}
            </span>
            <h2>{mode === "signin"
              ? signInMethod === "email-code" ? otpSent ? "Enter your email code." : "Get a sign-in code."
                : "Sign in to your farm."
              : "Create your account."}</h2>
            <p>
              {mode === "signin"
                ? signInMethod === "email-code"
                  ? otpSent
                    ? "Check your inbox and enter the six-digit code to continue."
                    : "We’ll email you a one-time code so you can securely access your field notes."
                  : "Enter your credentials to access your private field notes and run scans."
                : "Register with Supabase Auth to begin diagnosing crops and saving history."}
            </p>
          </div>

          <div className="auth-switch" role="tablist">
            <button
              type="button"
              className={mode === "signin" ? "active" : ""}
              onClick={() => { setMode("signin"); setOtpSent(false); setOtp(""); setError(""); setMessage(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => { setMode("signup"); setOtpSent(false); setOtp(""); setError(""); setMessage(""); }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="inline-alert error-alert" style={{ marginBottom: 16 }}>
              <CircleAlert size={16} />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="inline-alert success-alert" style={{ marginBottom: 16 }}>
              <Check size={16} />
              <span>{message}</span>
            </div>
          )}

          {mode === "signin" && (
            <div className="auth-method-switch" role="group" aria-label="Sign-in method">
              <button
                type="button"
                className={`text-button ${signInMethod === "email-code" ? "auth-method-active" : ""}`}
                onClick={() => {
                  setSignInMethod("email-code");
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
              >
                Email one-time code
              </button>
              <button
                type="button"
                className={`text-button ${signInMethod === "password" ? "auth-method-active" : ""}`}
                onClick={() => {
                  setSignInMethod("password");
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
              >
                Use password
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="field-label">
                Full Name
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>
            )}

            <label className="field-label">
              Email Address
              <input
                type="email"
                placeholder="grower@farm.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            {(mode === "signup" || signInMethod === "password") && (
              <label className="field-label">
                Password
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </label>
            )}

            {mode === "signin" && signInMethod === "email-code" && otpSent && (
              <label className="field-label">
                Six-digit email code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  pattern="[0-9]{6}"
                  minLength={6}
                  maxLength={6}
                />
              </label>
            )}

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={submitting}
            >
              <span>{submitting
                ? otpSent && signInMethod === "email-code" ? "Verifying code…" : "Authenticating…"
                : mode === "signup" ? "Create Account"
                  : signInMethod === "password" ? "Sign In to Verdant"
                    : otpSent ? "Verify email code" : "Send me a sign-in code"}</span>
              {submitting ? <LoaderCircle className="spin" size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>

          {mode === "signin" && signInMethod === "email-code" && otpSent && (
            <button
              type="button"
              className="text-button otp-resend"
              disabled={submitting}
              onClick={() => void resendOtp()}
            >
              Send a new code
            </button>
          )}

          <div className="auth-assurance">
            <ShieldCheck size={14} />
            <span>Secure email verification · Supabase Auth &amp; PostgreSQL RLS</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar({
  active,
  onChange,
  open,
  onClose,
  onSignOut,
  userName,
  email,
}: {
  active: Section;
  onChange: (section: Section) => void;
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
  userName: string;
  email: string;
}) {
  const navItems: { id: Section; title: string; icon: typeof Leaf }[] = [
    { id: "overview", title: "Overview", icon: Activity },
    { id: "diagnose", title: "New assessment", icon: ScanLine },
    { id: "history", title: "Scan history", icon: Clock3 },
    { id: "library", title: "Disease library", icon: BookOpen },
  ];
  const initials = userName.slice(0, 1).toUpperCase();

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <Link className="brand brand-light" href="/" aria-label="Verdant overview" onClick={onClose}>
          <span className="brand-mark"><Sprout size={23} /></span>
          <span>verdant<span className="brand-dot">.</span></span>
        </Link>
        <div className="side-caption">YOUR WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ id, title, icon: Icon }) => (
            <button
              className={`side-link ${active === id ? "side-link-active" : ""}`}
              key={id}
              onClick={() => {
                onChange(id);
                onClose();
              }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{title}</span>
              {id === "diagnose" && <span className="side-plus">+</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <div className="tip-icon"><Flower2 size={18} /></div>
          <strong>A note from the field</strong>
          <p>Take photos in natural light, with the affected leaf filling most of the frame.</p>
          <button onClick={() => onChange("diagnose")}>Try a scan <ArrowRight size={14} /></button>
          <div className="tip-leaf"><Leaf size={68} /></div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-row">
            <div className="avatar">{initials}</div>
            <div className="profile-info">
              <strong>{userName}</strong>
              <span>{email}</span>
            </div>
            <ChevronDown size={15} />
          </div>
          <button className="signout-link" onClick={onSignOut}>
            <LogOut size={16} /> Sign out
          </button>
          <span className="sidebar-version">GROW WITH CARE · VERDANT</span>
        </div>
      </aside>
    </>
  );
}

function ImageDropzone({
  onFile,
  busy,
}: {
  onFile: (file: File) => void;
  busy: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [invalid, setInvalid] = useState("");

  function acceptFile(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setInvalid("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setInvalid("That image is over 10 MB. Choose a smaller file.");
      return;
    }
    setInvalid("");
    onFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="visually-hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])}
        disabled={busy}
      />
      <div
        className={`dropzone ${dragging ? "dropzone-active" : ""} ${busy ? "dropzone-busy" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <button
          className="dropzone-content"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <span className="upload-icon"><CloudUpload size={25} strokeWidth={1.8} /></span>
          <strong>{busy ? "Examining your leaf…" : "Drop your leaf photo here"}</strong>
          <span>{busy ? "A little patience while we take a closer look." : "or browse files on your device"}</span>
          <span className="button button-outline browse-button">
            {busy ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />}
            {busy ? "Assessing image" : "Choose a photo"}
          </span>
        </button>
        <span className="file-spec">JPEG, PNG or WebP <i>·</i> Max 10 MB</span>
        {invalid && <span className="drop-error" role="alert">{invalid}</span>}
      </div>
    </>
  );
}

function MiniTrend({ scans }: { scans: Scan[] }) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = date.toLocaleDateString();
      const count = scans.filter(
        (scan) => new Date(scan.created_at).toLocaleDateString() === dateKey,
      ).length;
      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        count,
      };
    });
  }, [scans]);
  const max = Math.max(...days.map((day) => day.count), 1);

  return (
    <div className="trend-chart" aria-label="Scans per day for the last seven days">
      {days.map((day, index) => (
        <div className="trend-column" key={`${day.label}-${index}`}>
          <span className="trend-bar-wrap">
            <span
              className={`trend-bar ${day.count > 0 ? "trend-bar-filled" : ""}`}
              style={{ height: `${day.count === 0 ? 8 : Math.max(14, (day.count / max) * 100)}%` }}
              title={`${day.count} ${day.count === 1 ? "scan" : "scans"}`}
            />
          </span>
          <span className="trend-label">{day.label}</span>
        </div>
      ))}
    </div>
  );
}

function PredictionResult({
  result,
  onStartConsultation,
  onOpenChat,
}: {
  result: Diagnosis;
  onStartConsultation: (mode: "voice" | "video") => void;
  onOpenChat: () => void;
}) {
  return (
    <DiseaseGuidanceCard
      result={result}
      onStartConsultation={onStartConsultation}
      onOpenChat={onOpenChat}
    />
  );
}

function DiagnosePanel({
  token,
  onSaved,
}: {
  token: string;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [inputMethod, setInputMethod] = useState<"photo" | "video">("photo");
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationMode, setConsultationMode] = useState<"voice" | "video">("voice");
  const previewRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function diagnose(file: File) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPreview(previewRef.current);
    setSelectedFile(file);
    setResult(null);
    setError("");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await apiRequest<Diagnosis>("/api/v1/diagnose", token, {
        method: "POST",
        body: form,
      });
      setResult(response);
      onSaved();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn’t assess that image. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setSelectedFile(null);
    setPreview("");
    setResult(null);
    setError("");
  }

  return (
    <div className="diagnose-layout">
      <div className="diagnose-main">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FARMER-FRIENDLY CROP CARE</span>
            <h2>Let’s see what your crop is telling us.</h2>
            <p>Upload a clear leaf photo or short video clip for an honest, actionable assessment.</p>
          </div>
          {selectedFile && (
            <button className="text-button" onClick={reset} disabled={busy}>
              <X size={16} /> Start over
            </button>
          )}
        </div>

        {preview && (
          <div className="selected-photo">
            {/* Uploaded previews are local object URLs and are intentionally not optimized by Next. */}
            <img src={preview} alt="Selected leaf for crop assessment" />
            <div className="selected-photo-info">
              <span className="photo-ready"><Check size={14} /> {busy ? "Assessment in progress" : result ? "Assessment complete" : "Photo selected"}</span>
              <strong>{selectedFile?.name}</strong>
              <span>{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
            </div>
          </div>
        )}

        {!result && (
          <div className="scanner-input-container">
            <div className="input-method-tabs" role="tablist">
              <button
                type="button"
                className={`input-tab-btn ${inputMethod === "photo" ? "active" : ""}`}
                onClick={() => setInputMethod("photo")}
              >
                <Upload size={17} />
                <span>📷 Leaf Photo Upload</span>
              </button>
              <button
                type="button"
                className={`input-tab-btn ${inputMethod === "video" ? "active" : ""}`}
                onClick={() => setInputMethod("video")}
              >
                <Video size={17} />
                <span>📹 Video / Live Camera Scan</span>
              </button>
            </div>

            {inputMethod === "photo" ? (
              <ImageDropzone onFile={diagnose} busy={busy} />
            ) : (
              <VideoCameraScanner onCaptureFrame={diagnose} busy={busy} />
            )}
          </div>
        )}

        {error && (
          <div className="inline-alert error-alert diagnosis-error" role="alert">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="diagnosis-complete-wrapper">
            <PredictionResult
              result={result}
              onStartConsultation={(mode) => {
                setConsultationMode(mode);
                setConsultationOpen(true);
              }}
              onOpenChat={() => {
                document.getElementById("ask-verdant-ai")?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Embedded AI Agronomist Chatbot */}
            <div className="embedded-chat-section mt-8">
              <AiAgronomistChat
                key={result.scan_id}
                currentScan={result}
              />
            </div>

            {/* Expert Consultation Modal */}
            {consultationOpen && (
              <ExpertConsultationModal
                isOpen={consultationOpen}
                onClose={() => setConsultationOpen(false)}
                initialMode={consultationMode}
                currentScan={result}
              />
            )}
          </div>
        )}

        <div className="privacy-note">
          <ShieldCheck size={17} />
          <span>
            Your photo and scans stay in your private Supabase storage. Only you can view
            this scan and its image.
          </span>
        </div>
      </div>

      <aside className="photo-guide">
        <div className="guide-art"><Leaf size={50} strokeWidth={1.25} /><span><Sparkles size={16} /></span></div>
        <span className="eyebrow">A BETTER SCAN, A BETTER FIRST LOOK</span>
        <h3>Three simple field tips.</h3>
        <ul>
          <li><span className="guide-check"><Check size={13} /></span><span><strong>Find soft daylight</strong><small>Bright, even natural light reveals patterns clearly.</small></span></li>
          <li><span className="guide-check"><Check size={13} /></span><span><strong>Focus on one leaf</strong><small>Fill the frame with the leaf you’re concerned about.</small></span></li>
          <li><span className="guide-check"><Check size={13} /></span><span><strong>Keep camera steady</strong><small>Avoid blurry shots or motion during video walk-around.</small></span></li>
        </ul>
        <div className="guide-caution"><CircleAlert size={16} /><span>Zero jargon. If in doubt, connect with an agronomist using live call.</span></div>
      </aside>
    </div>
  );
}

function ScanList({
  scans,
  loading,
  error,
  token,
  compact = false,
}: {
  scans: Scan[];
  loading: boolean;
  error: string;
  token: string;
  compact?: boolean;
}) {
  const [openingId, setOpeningId] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [feedbackId, setFeedbackId] = useState("");
  const [correctedDisease, setCorrectedDisease] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState("");

  async function openImage(scan: Scan) {
    setOpeningId(scan.id);
    setImageError("");
    try {
      const response = await apiRequest<{ signed_url: string }>(
        `/api/v1/scans/${encodeURIComponent(scan.id)}/image`,
        token,
      );
      setImageUrls((previous) => ({ ...previous, [scan.id]: response.signed_url }));
    } catch (caught) {
      setImageError(caught instanceof Error ? caught.message : "Could not open this image.");
    } finally {
      setOpeningId("");
    }
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>, scan: Scan) {
    event.preventDefault();
    setFeedbackBusy(true);
    setFeedbackError("");
    setFeedbackNotice("");
    try {
      await apiRequest<{ feedback_id: string; status: string }>(
        "/api/v1/feedback",
        token,
        {
          method: "POST",
          body: JSON.stringify({
            scan_id: scan.id,
            predicted_disease: `${scan.crop} ${scan.disease}`,
            corrected_disease: correctedDisease,
            agronomist_notes: feedbackNotes || null,
          }),
        },
      );
      setFeedbackNotice("Your correction was saved. Thank you for helping improve the field record.");
      setFeedbackId("");
      setCorrectedDisease("");
      setFeedbackNotes("");
    } catch (caught) {
      setFeedbackError(
        caught instanceof Error ? caught.message : "Could not save your correction.",
      );
    } finally {
      setFeedbackBusy(false);
    }
  }

  if (loading) {
    return <div className="loading-state"><LoaderCircle className="spin" size={21} />Gathering your field notes…</div>;
  }
  if (error) {
    return <div className="inline-alert error-alert"><CircleAlert size={17} />{error}</div>;
  }
  if (scans.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><FileImage size={24} /></span>
        <strong>No scans just yet</strong>
        <p>Your completed crop assessments will find a home here.</p>
      </div>
    );
  }

  return (
    <div className={`scan-list ${compact ? "scan-list-compact" : ""}`}>
      {imageError && <div className="inline-alert error-alert"><CircleAlert size={16} />{imageError}</div>}
      {feedbackNotice && <div className="inline-alert success-alert" role="status"><Check size={16} />{feedbackNotice}</div>}
      {scans.map((scan) => (
        <div className="scan-entry" key={scan.id}>
          <article className="scan-row">
            <span className={`scan-crop-icon ${scan.is_healthy ? "crop-healthy" : ""}`}>
              {scan.is_healthy ? <HeartPulse size={19} /> : <Leaf size={19} />}
            </span>
            <div className="scan-row-main">
              <strong>{scan.disease}</strong>
              <span>{scan.crop} <i>·</i> {prettyDate(scan.created_at)}</span>
            </div>
            <div className="scan-confidence">
              <strong>{Math.round(scan.confidence * 100)}%</strong>
              <span>confidence</span>
            </div>
            <button
              className="icon-button image-open-button"
              onClick={() => void openImage(scan)}
              disabled={openingId === scan.id}
              aria-label={`Get private image link for ${scan.crop} ${scan.disease}`}
              title="Get a private link to the original image"
            >
              {openingId === scan.id ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={17} />}
            </button>
            <button
              className="icon-button image-open-button"
              onClick={() => {
                setFeedbackError("");
                setFeedbackId(feedbackId === scan.id ? "" : scan.id);
              }}
              aria-label={`Suggest a correction for ${scan.crop} ${scan.disease}`}
              title="Suggest a correction"
            >
              <MessageSquareText size={16} />
            </button>
          </article>
          {imageUrls[scan.id] && (
            <a
              className="private-image-link"
              href={imageUrls[scan.id]}
              target="_blank"
              rel="noreferrer"
            >
              <FileImage size={14} /> Open private image link <ArrowUpRight size={13} />
              <span>Expires in 5 minutes</span>
            </a>
          )}
          {feedbackId === scan.id && (
            <form
              className="feedback-form"
              onSubmit={(event) => void submitFeedback(event, scan)}
            >
              <label>
                What do you think the diagnosis should be?
                <input
                  value={correctedDisease}
                  onChange={(event) => setCorrectedDisease(event.target.value)}
                  required
                  maxLength={200}
                  placeholder="Your corrected crop or disease"
                />
              </label>
              <label>
                Notes <span className="optional-label">OPTIONAL</span>
                <textarea
                  value={feedbackNotes}
                  onChange={(event) => setFeedbackNotes(event.target.value)}
                  maxLength={4000}
                  rows={2}
                  placeholder="What did you observe in the field?"
                />
              </label>
              {feedbackError && <div className="inline-alert error-alert"><CircleAlert size={15} />{feedbackError}</div>}
              <div className="feedback-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setFeedbackId("")}
                  disabled={feedbackBusy}
                >
                  Cancel
                </button>
                <button className="button button-primary small-button" type="submit" disabled={feedbackBusy}>
                  {feedbackBusy ? <LoaderCircle className="spin" size={14} /> : <Send size={14} />}
                  Send correction
                </button>
              </div>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

function DiseaseLibrary({
  diseases,
  loading,
  error,
  onRefresh,
}: {
  diseases: Disease[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
}) {
  if (loading) return <div className="loading-state"><LoaderCircle className="spin" size={21} />Opening the field guide…</div>;
  if (error) return <div className="inline-alert error-alert"><CircleAlert size={17} />{error}<button className="text-button" onClick={onRefresh}>Try again <ArrowRight size={14} /></button></div>;
  if (diseases.length === 0) {
    return <div className="empty-state"><span className="empty-icon"><BookOpen size={24} /></span><strong>Your field guide is empty</strong><p>Run the Supabase database migration to add the disease information.</p></div>;
  }

  return (
    <div className="disease-grid">
      {diseases.map((disease) => (
        <article className="disease-card" key={disease.id}>
          <div className="disease-card-top">
            <span className="disease-leaf"><Leaf size={20} /></span>
            <span className="disease-crop">{disease.crop}</span>
          </div>
          <h3>{disease.name}</h3>
          <p>{disease.description}</p>
          <div className="disease-advice">
            <span><Sparkles size={14} /> A THOUGHTFUL NEXT STEP</span>
            <p>{disease.recommendation}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Overview({
  scans,
  loading,
  error,
  token,
  onNavigate,
  onRefresh,
}: {
  scans: Scan[];
  loading: boolean;
  error: string;
  token: string;
  onNavigate: (section: Section) => void;
  onRefresh: () => void;
}) {
  const averageConfidence = scans.length
    ? Math.round(
        (scans.reduce((total, scan) => total + scan.confidence, 0) / scans.length) *
          100,
      )
    : 0;
  const healthyCount = scans.filter((scan) => scan.is_healthy).length;
  const cropCount = new Set(scans.map((scan) => scan.crop)).size;

  return (
    <>
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow">A GOOD DAY TO GROW</span>
          <h2>Every healthy crop starts<br />with a closer look.</h2>
          <p>Get a thoughtful first read on a leaf, then decide your next move.</p>
          <button className="button button-light" onClick={() => onNavigate("diagnose")}>
            Start a new assessment <ArrowRight size={16} />
          </button>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <div className="illustration-sun" />
          <div className="illustration-hill hill-back" />
          <div className="illustration-hill hill-front" />
          <div className="illustration-stem"><span /><i /><b /></div>
          <div className="illustration-spark spark-one">✳</div>
          <div className="illustration-spark spark-two">✳</div>
        </div>
        <div className="welcome-watermark"><Sprout size={150} strokeWidth={0.8} /></div>
      </section>

      {error && <div className="inline-alert error-alert overview-error"><CircleAlert size={17} />{error}<button onClick={onRefresh}>Try again</button></div>}

      <section className="stats-grid" aria-label="Your scan summary">
        <article className="stat-card">
          <span className="stat-icon stat-icon-green"><ScanLine size={19} /></span>
          <span className="stat-label">TOTAL ASSESSMENTS</span>
          <strong className="stat-number">{loading ? "—" : scans.length}</strong>
          <span className="stat-footnote">{scans.length === 1 ? "one leaf checked so far" : "assessments saved to your account"}</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-lime"><HeartPulse size={19} /></span>
          <span className="stat-label">HEALTHY LEAVES</span>
          <strong className="stat-number">{loading ? "—" : healthyCount}</strong>
          <span className="stat-footnote">{scans.length ? "classified as healthy" : "your results will appear here"}</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-peach"><Wheat size={19} /></span>
          <span className="stat-label">CROPS CHECKED</span>
          <strong className="stat-number">{loading ? "—" : cropCount}</strong>
          <span className="stat-footnote">{scans.length ? "different crop types" : "a growing picture of your field"}</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-lilac"><Activity size={19} /></span>
          <span className="stat-label">AVG. MODEL CONFIDENCE</span>
          <strong className="stat-number">{loading || !scans.length ? "—" : `${averageConfidence}%`}</strong>
          <span className="stat-footnote">{scans.length ? "across your saved assessments" : "shown when scans are available"}</span>
        </article>
      </section>

      <section className="overview-lower">
        <article className="surface-card trend-card">
          <div className="card-heading">
            <div><span className="eyebrow">YOUR RHYTHM</span><h3>Field activity</h3></div>
            <span className="period-label"><span /> Last 7 days</span>
          </div>
          {loading ? <div className="loading-state"><LoaderCircle className="spin" size={18} />Updating activity…</div> : scans.length ? (
            <><MiniTrend scans={scans} /><div className="chart-note"><span className="chart-legend-dot" /> Completed assessments <strong>{scans.length}</strong></div></>
          ) : (
            <div className="empty-chart">
              <span className="empty-chart-line" />
              <span>No assessments to chart yet. Your activity will appear here once you complete your first scan.</span>
            </div>
          )}
        </article>

        <article className="surface-card insight-card">
          <div className="insight-top"><span className="insight-spark"><Sparkles size={17} /></span><span className="eyebrow">A GENTLE REMINDER</span></div>
          <h3>Small checks can make a big difference.</h3>
          <p>A quick look at a few leaves each week can help you notice changes before they spread.</p>
          <div className="insight-footer"><span><ShieldCheck size={15} /> Thoughtful care, season after season</span><Leaf size={19} /></div>
        </article>
      </section>

      <section className="surface-card recent-card">
        <div className="card-heading">
          <div><span className="eyebrow">YOUR LATEST NOTES</span><h3>Recent assessments</h3></div>
          <button className="text-button" onClick={() => onNavigate("history")}>See all <ArrowRight size={15} /></button>
        </div>
        <ScanList scans={scans.slice(0, 4)} loading={loading} error="" token={token} compact />
      </section>
    </>
  );
}

export function CropDashboard() {
  const { client, session, user, loading, configured, signOut } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scans, setScans] = useState<Scan[]>([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [scansError, setScansError] = useState("");
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [diseasesLoading, setDiseasesLoading] = useState(true);
  const [diseasesError, setDiseasesError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState("");
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const token = session?.access_token ?? "";

  const loadScans = useCallback(async () => {
    if (!token) return;
    setScansLoading(true);
    setScansError("");
    try {
      const response = await apiRequest<{ items: Scan[] }>(
        "/api/v1/scans?limit=100&offset=0",
        token,
      );
      setScans(response.items);
    } catch (caught) {
      setScansError(caught instanceof Error ? caught.message : "Could not load scan history.");
    } finally {
      setScansLoading(false);
    }
  }, [token]);

  const loadDiseases = useCallback(async () => {
    if (!token) return;
    setDiseasesLoading(true);
    setDiseasesError("");
    try {
      const response = await apiRequest<Disease[]>("/api/v1/diseases", token);
      setDiseases(response);
    } catch (caught) {
      setDiseasesError(caught instanceof Error ? caught.message : "Could not load disease information.");
    } finally {
      setDiseasesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    void apiRequest<{ items: Scan[] }>("/api/v1/scans?limit=100&offset=0", token)
      .then((response) => {
        if (active) setScans(response.items);
      })
      .catch((caught: unknown) => {
        if (active) {
          setScansError(
            caught instanceof Error ? caught.message : "Could not load scan history.",
          );
        }
      })
      .finally(() => {
        if (active) setScansLoading(false);
      });
    void apiRequest<Disease[]>("/api/v1/diseases", token)
      .then((response) => {
        if (active) setDiseases(response);
      })
      .catch((caught: unknown) => {
        if (active) {
          setDiseasesError(
            caught instanceof Error
              ? caught.message
              : "Could not load disease information.",
          );
        }
      })
      .finally(() => {
        if (active) setDiseasesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!client || !user) return;
    let pollingInterval: number | undefined;
    const channel = client
      .channel(`user-scans-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scans",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void loadScans();
        },
      )
      .subscribe((status, error) => {
        if (status === "SUBSCRIBED") {
          if (pollingInterval !== undefined) {
            window.clearInterval(pollingInterval);
            pollingInterval = undefined;
          }
          return;
        }
        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          console.warn(
            "Supabase Realtime is unavailable; scan history will refresh automatically.",
            error,
          );
          pollingInterval ??= window.setInterval(() => {
            void loadScans();
          }, 30_000);
        }
      });
    return () => {
      if (pollingInterval !== undefined) window.clearInterval(pollingInterval);
      void client.removeChannel(channel);
    };
  }, [client, user, loadScans]);

  if (loading) {
    return <main className="auth-loading"><LoaderCircle className="spin" size={24} /><span>Getting your field ready…</span></main>;
  }
  if (!configured) {
    return <ConfigScreen />;
  }
  if (!session || !user) {
    return <AuthScreen client={client} />;
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : undefined;
  const userName = initialName(metadataName, user.email);
  const details = sectionDetails[section];

  async function handleSignOut() {
    setSigningOut(true);
    setAuthError("");
    try {
      await signOut();
    } catch (caught) {
      setAuthError(caught instanceof Error ? caught.message : "Could not sign out.");
      setSigningOut(false);
    }
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar
          active={section}
          onChange={setSection}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onSignOut={() => void handleSignOut()}
          userName={userName}
          email={user.email ?? ""}
        />

        <main className="main-area">
          <header className="topbar">
            <button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
              <Menu size={21} />
            </button>
            <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{details.title}</strong></div>
            <div className="topbar-right">
              <span className="local-time"><span className="online-dot" /> YOUR PRIVATE FIELDSPACE</span>
              <button className="topbar-avatar" onClick={() => void handleSignOut()} title="Sign out" aria-label="Sign out">
                {userName.slice(0, 1).toUpperCase()}
              </button>
            </div>
          </header>

          <div className="page-content">
            {authError && <div className="inline-alert error-alert"><CircleAlert size={17} />{authError}</div>}
            <section className="page-title-row">
              <div>
                <span className="eyebrow">{details.eyebrow}</span>
                <h1>{details.title}</h1>
                <p>{details.subtitle}</p>
              </div>
              <div className="date-chip"><Clock3 size={15} />{new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(new Date())}</div>
            </section>

            {section === "overview" && (
              <Overview
                scans={scans}
                loading={scansLoading}
                error={scansError}
                token={token}
                onNavigate={setSection}
                onRefresh={() => void loadScans()}
              />
            )}
            {section === "diagnose" && (
              <DiagnosePanel token={token} onSaved={() => void loadScans()} />
            )}
            {section === "history" && (
              <section className="surface-card history-card">
                <div className="card-heading">
                  <div><span className="eyebrow">PRIVATE TO YOUR ACCOUNT</span><h3>All assessments <span className="heading-count">{scans.length}</span></h3></div>
                  <button className="button button-outline small-button" onClick={() => void loadScans()} disabled={scansLoading}>
                    {scansLoading ? <LoaderCircle className="spin" size={15} /> : <Activity size={15} />} Refresh
                  </button>
                </div>
                <ScanList scans={scans} loading={scansLoading} error={scansError} token={token} />
              </section>
            )}
            {section === "library" && (
              <section className="library-section">
                <div className="library-note"><BookOpen size={18} /><span>Guidance is general and may not account for your location, crop variety, or local regulations.</span></div>
                <DiseaseLibrary
                  diseases={diseases}
                  loading={diseasesLoading}
                  error={diseasesError}
                  onRefresh={() => void loadDiseases()}
                />
              </section>
            )}
          </div>
          <footer className="page-footer">
            <span><Sprout size={15} /> A little more certainty, every day.</span>
            <span>Built for careful growing <Leaf size={14} /></span>
          </footer>

          {/* Floating AI Agronomist Trigger */}
          <button
            type="button"
            className="floating-ai-trigger-btn"
            onClick={() => setFloatingChatOpen(!floatingChatOpen)}
            title="Ask Verdant AI"
            aria-label="Open AI Agronomist Chat"
          >
            <Sparkles size={18} />
            <span>🌱 Ask Verdant AI</span>
          </button>

          <AiAgronomistChat
            key={scans[0]?.id ?? "no-scan"}
            currentScan={scans[0] ? {
              scan_id: scans[0].id,
              prediction: {
                crop: scans[0].crop,
                disease: scans[0].disease,
                confidence: scans[0].confidence,
                is_healthy: scans[0].is_healthy,
              },
              top_candidates: scans[0].top_candidates || [],
              disease_info: null,
              image_path: scans[0].image_path || "",
              created_at: scans[0].created_at,
            } : null}
            isOpen={floatingChatOpen}
            onClose={() => setFloatingChatOpen(false)}
            isFloating={true}
          />
        </main>
      </div>
      {signingOut && <div className="signout-overlay"><LoaderCircle className="spin" size={20} />Signing you out securely…</div>}
    </>
  );
}
