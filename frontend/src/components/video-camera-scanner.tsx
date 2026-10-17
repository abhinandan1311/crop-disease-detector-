"use client";

import {
  Camera,
  Check,
  CircleAlert,
  Film,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VideoCameraScannerProps {
  onCaptureFrame: (file: File) => void;
  busy: boolean;
}

function getCameraErrorMessage(error: unknown): string {
  const errorName = error instanceof Error ? error.name : "";

  if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
    return (
      "Camera permission is blocked for this site. In your browser, open the " +
      "site settings from the icon beside the address, set Camera to Allow, " +
      "then reload and try again. Also check Windows Settings > Privacy & " +
      "security > Camera."
    );
  }
  if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
    return "No camera was found. Connect or enable a camera, then try again.";
  }
  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return (
      "The camera is already in use or unavailable. Close other apps using " +
      "the camera and check Windows camera privacy settings, then try again."
    );
  }
  if (errorName === "OverconstrainedError" || errorName === "ConstraintNotSatisfiedError") {
    return "The available camera does not support the requested video settings.";
  }
  if (errorName === "SecurityError") {
    return "Camera access is blocked by browser security settings. Allow camera access for this site and reload.";
  }
  if (error instanceof Error && error.message) {
    return `Could not start the camera: ${error.message}`;
  }
  return "Could not start the camera. Check browser and Windows camera permissions, then try again.";
}

export function VideoCameraScanner({
  onCaptureFrame,
  busy,
}: VideoCameraScannerProps) {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Live camera stream state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs and stream on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videoUrl]);

  // Extract a representative frame from a video file
  const extractFrameFromVideo = useCallback(
    (video: HTMLVideoElement) => {
      setIsExtracting(true);
      setError("");

      const onSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Could not initialize 2D drawing context.");
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setError("Could not extract a clear frame from this video.");
                setIsExtracting(false);
                return;
              }

              const previewUrl = URL.createObjectURL(blob);
              setExtractedPreview(previewUrl);

              // Create File object compatible with diagnose API
              const frameFile = new File(
                [blob],
                `video-frame-${Date.now()}.jpg`,
                { type: "image/jpeg" },
              );
              setIsExtracting(false);
              onCaptureFrame(frameFile);
            },
            "image/jpeg",
            0.92,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to capture video frame.",
          );
          setIsExtracting(false);
        }
      };

      video.addEventListener("seeked", onSeeked, { once: true });
      // Seek to 1 second or 20% into the video to avoid start blur
      const targetTime = Math.min(1.0, (video.duration || 2) * 0.25);
      video.currentTime = targetTime;
    },
    [onCaptureFrame],
  );

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file (.mp4, .webm, or .mov).");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video exceeds 50 MB. Please upload a shorter clip.");
      return;
    }

    setError("");
    setVideoFile(file);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  // Start Live Camera
  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "This browser cannot access a camera. Open the site in a current browser using HTTPS or localhost.",
      );
      return;
    }
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play();
      }
      setIsStreaming(true);
    } catch (err) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(getCameraErrorMessage(err));
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsRecording(false);
  };

  // Capture instant frame from live camera
  const captureLiveFrame = () => {
    if (!cameraVideoRef.current) return;
    const video = cameraVideoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const previewUrl = URL.createObjectURL(blob);
        setExtractedPreview(previewUrl);
        const capturedFile = new File(
          [blob],
          `camera-scan-${Date.now()}.jpg`,
          { type: "image/jpeg" },
        );
        stopCamera();
        onCaptureFrame(capturedFile);
      },
      "image/jpeg",
      0.95,
    );
  };

  // Record a 5-second walk-around scan and extract sharpest frame
  const startWalkAroundRecording = () => {
    setIsRecording(true);
    setCountdown(5);

    let timeLeft = 5;
    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        captureLiveFrame();
      }
    }, 1000);
  };

  return (
    <div className="multimedia-scanner-wrap">
      {/* Mode Switcher */}
      <div className="scanner-mode-switch">
        <button
          type="button"
          className={`scanner-tab ${mode === "upload" ? "active" : ""}`}
          onClick={() => {
            stopCamera();
            setMode("upload");
          }}
        >
          <Film size={18} />
          <span>Upload Video Clip (.mp4 / .webm)</span>
        </button>
        <button
          type="button"
          className={`scanner-tab ${mode === "camera" ? "active" : ""}`}
          onClick={() => {
            setMode("camera");
            startCamera();
          }}
        >
          <Camera size={18} />
          <span>Live Camera Walk-around</span>
        </button>
      </div>

      {error && (
        <div className="inline-alert error-alert my-3" role="alert">
          <CircleAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Sub-mode 1: Video File Upload */}
      {mode === "upload" && (
        <div className="video-upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
            className="visually-hidden"
            onChange={handleVideoSelect}
            disabled={busy || isExtracting}
          />

          {!videoUrl ? (
            <div
              className="video-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="video-drop-icon">
                <Video size={36} />
              </div>
              <strong className="text-base text-emerald-950 font-semibold">
                Upload a short plant walk-around video
              </strong>
              <p className="text-sm text-emerald-800/80 max-w-md text-center">
                Slowly pan around the diseased leaf or plant stem. We will
                automatically extract a crystal-clear frame to assess.
              </p>
              <button
                type="button"
                className="button button-primary mt-2"
                disabled={busy}
              >
                <Upload size={16} /> Choose Video (.mp4 / .webm)
              </button>
              <span className="text-xs text-muted mt-2">
                Supported formats: MP4, WebM, MOV • Max 50 MB
              </span>
            </div>
          ) : (
            <div className="video-player-preview-card">
              <div className="video-header-info">
                <div className="flex items-center gap-2">
                  <Film size={18} className="text-emerald-700" />
                  <strong className="text-sm">{videoFile?.name}</strong>
                </div>
                <button
                  type="button"
                  className="text-xs text-red-700 hover:underline flex items-center gap-1"
                  onClick={() => {
                    if (videoUrl) URL.revokeObjectURL(videoUrl);
                    setVideoUrl("");
                    setVideoFile(null);
                  }}
                >
                  <X size={14} /> Remove
                </button>
              </div>

              <div className="video-container relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoElementRef}
                  src={videoUrl}
                  controls
                  playsInline
                  className="w-full max-h-72 object-contain"
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    extractFrameFromVideo(video);
                  }}
                />
              </div>

              <div className="video-extract-status">
                {isExtracting ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-800">
                    <LoaderCircle size={16} className="spin" />
                    <span>Analyzing video & capturing best diagnostic frame…</span>
                  </div>
                ) : extractedPreview ? (
                  <div className="flex items-center justify-between gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={extractedPreview}
                        alt="Captured diagnostic frame"
                        className="w-14 h-14 object-cover rounded-lg border border-emerald-300"
                      />
                      <div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
                          <Check size={14} /> Sharp Frame Extracted
                        </div>
                        <span className="text-xs text-emerald-950">
                          Ready for AI crop diagnosis
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="button button-outline text-xs px-3 py-1.5"
                      onClick={() => {
                        if (videoElementRef.current && videoFile) {
                          extractFrameFromVideo(videoElementRef.current);
                        }
                      }}
                    >
                      <RefreshCw size={14} /> Re-capture Frame
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-mode 2: Live Camera Viewfinder */}
      {mode === "camera" && (
        <div className="camera-viewfinder-card">
          <div className="viewfinder-viewport relative bg-black rounded-2xl overflow-hidden">
            <video
              ref={cameraVideoRef}
              playsInline
              muted
              className="w-full h-80 object-cover"
            />

            {/* Target reticle overlay */}
            <div className="camera-leaf-guide">
              <div className="reticle-corner corner-tl" />
              <div className="reticle-corner corner-tr" />
              <div className="reticle-corner corner-bl" />
              <div className="reticle-corner corner-br" />
              <span className="reticle-label">
                Center the diseased leaf here
              </span>
            </div>

            {isRecording && (
              <div className="recording-overlay">
                <div className="record-badge">
                  <span className="record-pulse" />
                  <span>Recording Walk-around… {countdown}s</span>
                </div>
              </div>
            )}
          </div>

          <div className="viewfinder-controls">
            {!isStreaming ? (
              <button
                type="button"
                className="button button-primary"
                onClick={startCamera}
              >
                <Camera size={18} /> Turn On Camera
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  className="button button-outline text-sm"
                  onClick={captureLiveFrame}
                  disabled={isRecording || busy}
                >
                  <Camera size={16} /> Snap Single Leaf Photo
                </button>

                <button
                  type="button"
                  className={`button ${isRecording ? "button-danger" : "button-primary"} text-sm`}
                  onClick={startWalkAroundRecording}
                  disabled={isRecording || busy}
                >
                  <Sparkles size={16} />
                  {isRecording
                    ? `Recording (${countdown}s)…`
                    : "Record 5s Walk-around Scan"}
                </button>

                <button
                  type="button"
                  className="button button-outline text-sm text-red-700"
                  onClick={stopCamera}
                >
                  <X size={16} /> Stop Camera
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
