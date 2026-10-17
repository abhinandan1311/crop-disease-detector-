"use client";

import {
  Check,
  CheckCircle2,
  Leaf,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Share2,
  ShieldCheck,
  Sparkles,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Diagnosis } from "@/lib/api";

interface ExpertConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "voice" | "video";
  currentScan: Diagnosis | null;
}

export function ExpertConsultationModal({
  isOpen,
  onClose,
  initialMode,
  currentScan,
}: ExpertConsultationModalProps) {
  const [mode, setMode] = useState<"voice" | "video">(initialMode);
  const [callState, setCallState] = useState<
    "connecting" | "ringing" | "connected" | "ended"
  >("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isReportShared, setIsReportShared] = useState(false);
  const [agronomistNotes, setAgronomistNotes] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call connection state sequence
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Step 1: Connecting (1s)
    const t1 = setTimeout(() => {
      setCallState("ringing");
    }, 1200);

    // Step 2: Connected (2.8s)
    const t2 = setTimeout(() => {
      setCallState("connected");
      // Initial notes from agronomist
      if (currentScan) {
        setAgronomistNotes([
          `Dr. Ramesh: "Namaste! I am reviewing your ${currentScan.prediction.crop} scan. How long have you noticed these symptoms in the field?"`,
        ]);
      } else {
        setAgronomistNotes([
          `Dr. Ramesh: "Hello! I am Dr. Ramesh Patel, Senior Agronomist. Tell me what is happening with your crop."`,
        ]);
      }
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentScan]);

  // Call duration counter
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const shareReportWithDoctor = () => {
    setIsReportShared(true);
    setAgronomistNotes((prev) => [
      ...prev,
      `📋 Scan Report shared with Dr. Ramesh: ${currentScan?.prediction.crop} — ${currentScan?.prediction.disease} (${Math.round((currentScan?.prediction.confidence || 0) * 100)}% match).`,
      `Dr. Ramesh: "I received your leaf diagnosis. Please prune the lower affected leaves immediately and keep moisture off the foliage. Let's discuss treatment timing."`,
    ]);
  };

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      className="consultation-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Live Agronomist Consultation"
    >
      <div className="consultation-card">
        {/* Top Header */}
        <div className="consultation-topbar">
          <div className="doctor-badge-info">
            <div className="doctor-avatar-circle">
              <span className="online-beacon" />
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-base text-white font-semibold">
                  Dr. Ramesh Patel
                </strong>
                <span className="doc-credential">Senior Agronomist</span>
              </div>
              <span className="doc-specialty">
                Crop Pathology • ICAR Certified • 14 Yrs Exp.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="secure-call-tag">
              <ShieldCheck size={14} /> Encrypted
            </span>
            <button
              type="button"
              className="consult-close-btn"
              onClick={handleEndCall}
              aria-label="Close consultation modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Call Stage View */}
        <div className="consultation-body">
          {callState === "connecting" && (
            <div className="call-status-screen">
              <div className="pulse-ripple">
                <PhoneCall size={36} className="text-emerald-400" />
              </div>
              <h3>Connecting with On-Duty Agronomist…</h3>
              <p>Locating the nearest agricultural specialist in your region.</p>
            </div>
          )}

          {callState === "ringing" && (
            <div className="call-status-screen">
              <div className="pulse-ripple ring-pulse">
                <PhoneCall size={36} className="text-emerald-300" />
              </div>
              <h3>Ringing Dr. Ramesh Patel…</h3>
              <p>Available on Plant Doctor Hotline (Hindi, English, Regional)</p>
            </div>
          )}

          {callState === "connected" && (
            <div className="call-active-stage">
              {/* If Video Mode: Video Simulation */}
              {mode === "video" ? (
                <div className="doctor-video-viewport">
                  {/* Doctor Simulated Stream */}
                  <div className="doctor-video-feed">
                    <div className="doctor-video-header">
                      <span className="doctor-live-tag">
                        <span className="pulse-dot" /> LIVE
                      </span>
                      <span className="doctor-stream-name">
                        Dr. Ramesh Patel (Field Lab)
                      </span>
                    </div>

                    {/* Visual representative agronomist environment */}
                    <div className="doctor-mock-camera">
                      <div className="doctor-silhouette">
                        <div className="doctor-badge-large">👨‍🌾</div>
                        <div className="doctor-speaking-wave">
                          <span className="wave-bar" />
                          <span className="wave-bar" />
                          <span className="wave-bar" />
                          <span className="wave-bar" />
                        </div>
                        <span className="doctor-speaking-label">
                          Doctor is speaking…
                        </span>
                      </div>
                    </div>

                    {/* Self Farmer PiP View */}
                    <div className="farmer-pip-window">
                      {!isVideoMuted ? (
                        <div className="farmer-pip-active">
                          <span>Your Plant Cam</span>
                          <Leaf size={18} className="text-emerald-300" />
                        </div>
                      ) : (
                        <div className="farmer-pip-off">
                          <VideoOff size={16} />
                          <span>Cam Off</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Voice Mode Display */
                <div className="doctor-voice-viewport">
                  <div className="voice-call-avatar">
                    <span className="voice-avatar-emoji">👨‍🌾</span>
                    <div className="voice-waves-container">
                      <div className="voice-ring wave-1" />
                      <div className="voice-ring wave-2" />
                      <div className="voice-ring wave-3" />
                    </div>
                  </div>
                  <strong className="text-xl text-white mt-3 font-semibold">
                    Dr. Ramesh Patel
                  </strong>
                  <span className="text-emerald-300 text-sm">
                    In Consultation
                  </span>
                  <div className="call-timer-badge">
                    <span className="timer-dot" />
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* In-Call Notes & Advice Feed */}
              <div className="doctor-live-notes">
                <div className="notes-header">
                  <Sparkles size={16} className="text-emerald-300" />
                  <span>Live Agronomist Advice & Transcript</span>
                </div>
                <div className="notes-content">
                  {agronomistNotes.map((note, index) => (
                    <div key={index} className="note-bubble">
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share current scan report with Doctor */}
              {currentScan && (
                <div className="share-scan-prompt">
                  <div className="flex items-center gap-2">
                    <Leaf size={18} className="text-emerald-300" />
                    <span className="text-sm text-emerald-100">
                      Current Scan: <strong>{currentScan.prediction.crop}</strong>{" "}
                      — {currentScan.prediction.disease}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`share-report-btn ${isReportShared ? "shared" : ""}`}
                    onClick={shareReportWithDoctor}
                    disabled={isReportShared}
                  >
                    {isReportShared ? (
                      <>
                        <Check size={16} /> Report Received by Doctor
                      </>
                    ) : (
                      <>
                        <Share2 size={16} /> Send Report to Doctor
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {callState === "ended" && (
            <div className="call-status-screen">
              <CheckCircle2 size={44} className="text-emerald-400" />
              <h3>Consultation Finished</h3>
              <p>
                A summary of Dr. Ramesh&apos;s recommendations has been saved to
                your field notes.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        {callState === "connected" && (
          <div className="consultation-footer-controls">
            <button
              type="button"
              className={`call-control-btn ${isMuted ? "control-active-red" : ""}`}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              <span>{isMuted ? "Muted" : "Mute"}</span>
            </button>

            <button
              type="button"
              className={`call-control-btn ${isVideoMuted ? "control-active-red" : ""}`}
              onClick={() => {
                if (mode === "voice") {
                  setMode("video");
                  setIsVideoMuted(false);
                } else {
                  setIsVideoMuted(!isVideoMuted);
                }
              }}
              title="Toggle camera"
            >
              {mode === "video" && !isVideoMuted ? (
                <Video size={20} />
              ) : (
                <VideoOff size={20} />
              )}
              <span>{mode === "video" ? "Camera" : "Switch to Video"}</span>
            </button>

            <button
              type="button"
              className="call-control-btn btn-end-call"
              onClick={handleEndCall}
              title="End consultation"
            >
              <PhoneOff size={22} />
              <span>End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
