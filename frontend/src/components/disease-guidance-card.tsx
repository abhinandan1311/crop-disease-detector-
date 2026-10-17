"use client";

import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Leaf,
  PhoneCall,
  Pill,
  Shield,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { useState } from "react";

import type { Diagnosis } from "@/lib/api";
import {
  getDiseaseGuidance,
  type DiseaseGuidance,
} from "@/lib/disease-knowledge";

interface DiseaseGuidanceCardProps {
  result: Diagnosis;
  onStartConsultation: (mode: "voice" | "video") => void;
  onOpenChat: () => void;
}

export function DiseaseGuidanceCard({
  result,
  onStartConsultation,
  onOpenChat,
}: DiseaseGuidanceCardProps) {
  const [activeRemedyTab, setActiveRemedyTab] = useState<
    "firstAid" | "organic" | "chemical"
  >("firstAid");

  const { crop, disease, is_healthy, confidence } = result.prediction;
  const guidance: DiseaseGuidance = getDiseaseGuidance(
    crop,
    disease,
    is_healthy,
  );

  const severityColors = {
    Healthy: {
      badge: "badge-healthy",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      accent: "#2e7d32",
    },
    Moderate: {
      badge: "badge-moderate",
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      accent: "#d97706",
    },
    High: {
      badge: "badge-high",
      bg: "bg-orange-50 border-orange-200 text-orange-900",
      accent: "#ea580c",
    },
    Critical: {
      badge: "badge-critical",
      bg: "bg-red-50 border-red-200 text-red-900",
      accent: "#dc2626",
    },
  }[guidance.severity];

  return (
    <section className="farmer-assessment-card" aria-live="polite">
      {/* Header Banner */}
      <div className="farmer-header-banner">
        <div className="farmer-title-group">
          <div className="farmer-crop-tag">
            <Leaf size={18} className="text-emerald-700" />
            <span>{guidance.crop}</span>
            <span className="bullet-sep">•</span>
            <span className="confidence-pill">
              {Math.round(confidence * 100)}% Match
            </span>
          </div>

          <h2 className="farmer-disease-title">{guidance.disease}</h2>

          <div className="farmer-badge-row">
            <span className={`status-pill ${severityColors.badge}`}>
              {guidance.severity === "Healthy" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              {guidance.severity === "Healthy"
                ? "Plant is Healthy & Thriving"
                : `${guidance.severity} Severity — Action Needed`}
            </span>
          </div>
        </div>

        {/* Action buttons for quick help */}
        <div className="farmer-consult-actions">
          <button
            type="button"
            className="consult-btn consult-voice"
            onClick={() => onStartConsultation("voice")}
            title="Speak with a live agronomist on call"
          >
            <PhoneCall size={18} />
            <span>Voice Call Doctor</span>
          </button>
          <button
            type="button"
            className="consult-btn consult-video"
            onClick={() => onStartConsultation("video")}
            title="Start live video consultation with agronomist"
          >
            <Video size={18} />
            <span>Video Call Doctor</span>
          </button>
          <button
            type="button"
            className="consult-btn consult-ai"
            onClick={onOpenChat}
            title="Ask Verdant AI any questions about this disease"
          >
            <Sparkles size={18} />
            <span>Ask Verdant AI</span>
          </button>
        </div>
      </div>

      {/* Structured Farmer-Friendly Sections */}
      <div className="farmer-sections-grid">
        {/* SECTION 1: WHAT IS THIS DISEASE? */}
        <div className="farmer-section-card what-is-it-card">
          <div className="section-card-header">
            <div className="section-icon-wrap icon-green">
              <Leaf size={22} />
            </div>
            <div>
              <span className="section-eyebrow">CLEAR EXPLANATION</span>
              <h3 className="section-title">🌿 What is this condition?</h3>
            </div>
          </div>
          <p className="farmer-body-text">{guidance.whatIsIt}</p>
        </div>

        {/* SECTION 2: ROOT CAUSES (WHY DID MY CROP GET THIS?) */}
        <div className="farmer-section-card root-causes-card">
          <div className="section-card-header">
            <div className="section-icon-wrap icon-amber">
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="section-eyebrow">ORIGINS & TRIGGERS</span>
              <h3 className="section-title">
                ❓ Why did my crop get this? (Root Causes)
              </h3>
            </div>
          </div>
          <div className="causes-subgrid">
            {guidance.rootCauses.map((cause, idx) => (
              <div className="cause-item-card" key={idx}>
                <span className="cause-icon-emoji" aria-hidden="true">
                  {cause.icon}
                </span>
                <div className="cause-content">
                  <strong className="cause-title">{cause.title}</strong>
                  <p className="cause-detail">{cause.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: PRECAUTIONS & PREVENTION */}
        <div className="farmer-section-card prevention-card">
          <div className="section-card-header">
            <div className="section-icon-wrap icon-blue">
              <Shield size={22} />
            </div>
            <div>
              <span className="section-eyebrow">PROTECT FUTURE HARVESTS</span>
              <h3 className="section-title">🛡️ Precautions & Prevention</h3>
            </div>
          </div>
          <div className="prevention-subgrid">
            {guidance.prevention.map((item, idx) => (
              <div className="prevention-item-card" key={idx}>
                <div className="prevention-bullet">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong className="prevention-title">{item.title}</strong>
                  <p className="prevention-detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: STEP-BY-STEP REMEDIES & TREATMENT */}
        <div className="farmer-section-card remedies-card">
          <div className="section-card-header">
            <div className="section-icon-wrap icon-emerald">
              <Pill size={22} />
            </div>
            <div>
              <span className="section-eyebrow">STEP-BY-STEP TREATMENT</span>
              <h3 className="section-title">
                💊 Recommended Remedies & Treatments
              </h3>
            </div>
          </div>

          {/* Remedy Navigation Tabs */}
          <div className="remedy-nav-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeRemedyTab === "firstAid"}
              className={`remedy-tab-btn ${activeRemedyTab === "firstAid" ? "active" : ""}`}
              onClick={() => setActiveRemedyTab("firstAid")}
            >
              <span>⚡ Immediate First Aid</span>
              <span className="tab-count">
                {guidance.remedies.firstAid.length}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRemedyTab === "organic"}
              className={`remedy-tab-btn ${activeRemedyTab === "organic" ? "active" : ""}`}
              onClick={() => setActiveRemedyTab("organic")}
            >
              <span>🍃 Organic & Home Remedies</span>
              <span className="tab-count">
                {guidance.remedies.organic.length}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRemedyTab === "chemical"}
              className={`remedy-tab-btn ${activeRemedyTab === "chemical" ? "active" : ""}`}
              onClick={() => setActiveRemedyTab("chemical")}
            >
              <span>🧪 Chemical / Standard Spray</span>
              <span className="tab-count">
                {guidance.remedies.chemical.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Immediate First Aid */}
          {activeRemedyTab === "firstAid" && (
            <div className="remedy-tab-panel">
              <div className="first-aid-banner">
                <strong>Do this today before applying sprays:</strong>
              </div>
              <ul className="first-aid-list">
                {guidance.remedies.firstAid.map((step, idx) => (
                  <li key={idx} className="first-aid-item">
                    <span className="first-aid-number">{idx + 1}</span>
                    <span className="first-aid-text">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 2: Organic & Home Remedies */}
          {activeRemedyTab === "organic" && (
            <div className="remedy-tab-panel">
              <div className="remedy-cards-list">
                {guidance.remedies.organic.map((org, idx) => (
                  <div className="organic-item-card" key={idx}>
                    <div className="remedy-item-head">
                      <span className="organic-badge">Organic Solution</span>
                      <h4 className="remedy-item-title">{org.remedy}</h4>
                    </div>
                    <div className="remedy-detail-block">
                      <span className="detail-label">🥣 How to Prepare:</span>
                      <p className="detail-value">{org.preparation}</p>
                    </div>
                    <div className="remedy-detail-block">
                      <span className="detail-label">
                        ⏰ When & How Often:
                      </span>
                      <p className="detail-value">{org.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Chemical Treatment */}
          {activeRemedyTab === "chemical" && (
            <div className="remedy-tab-panel">
              <div className="chemical-safety-notice">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>
                  Always wear protective gear (gloves & mask). Do not spray
                  during high heat, rain, or when pollinators are active.
                </span>
              </div>
              <div className="remedy-cards-list">
                {guidance.remedies.chemical.map((chem, idx) => (
                  <div className="chemical-item-card" key={idx}>
                    <div className="remedy-item-head">
                      <span className="chemical-badge">Active Chemical</span>
                      <h4 className="remedy-item-title">{chem.name}</h4>
                    </div>
                    <div className="remedy-detail-block">
                      <span className="detail-label">⚖️ Recommended Dosage:</span>
                      <p className="detail-value font-semibold text-emerald-950">
                        {chem.dosage}
                      </p>
                    </div>
                    <div className="remedy-detail-block">
                      <span className="detail-label">
                        ⚠️ Application & Withholding Period:
                      </span>
                      <p className="detail-value">{chem.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Differential diagnoses */}
      {result.top_candidates.length > 1 && (
        <div className="differential-panel">
          <span className="section-eyebrow">OTHER POSSIBILITIES EVALUATED</span>
          <div className="differential-grid">
            {result.top_candidates.slice(1).map((cand, idx) => (
              <div
                className="differential-row"
                key={`${cand.crop}-${cand.disease}-${idx}`}
              >
                <span className="diff-name">
                  {cand.crop} • {cand.disease}
                </span>
                <span className="diff-bar-wrap">
                  <span
                    className="diff-bar"
                    style={{ width: `${Math.round(cand.confidence * 100)}%` }}
                  />
                </span>
                <span className="diff-percent">
                  {Math.round(cand.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
