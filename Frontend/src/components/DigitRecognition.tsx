import { useState, useRef, useCallback, useEffect } from "react";
import { Brain, Loader2, AlertCircle, Eraser, Sparkles } from "lucide-react";

const DigitRecognition = () => {
  const [prediction, setPrediction] = useState<{ digit: number; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasDrawn, setHasDrawn] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return ctx;
  }, []);

  const clearCanvas = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 280, 280);
    setHasDrawn(false);
    setPrediction(null);
    setError("");
    setPreviewSrc("");
  }, [getCtx]);

  const initCanvas = useCallback(() => {
    clearCanvas();
  }, [clearCanvas]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 280 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    isDrawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handlePredict = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    setLoading(true);
    setError("");
    setPrediction(null);

    const base64Image = canvas.toDataURL("image/png");
    setPreviewSrc(base64Image);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPrediction({
        digit: data.prediction ?? data.predicted_digit ?? data.digit,
        confidence: data.confidence,
      });
    } catch (err: any) {
      setError(err.message || "Failed to connect to the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Handwritten Digit <span className="text-primary">Recognition</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Draw a digit below and let the AI predict it
        </p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-primary/5">
        {/* Canvas */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Draw here
          </label>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-[280px] h-[280px] rounded-xl border border-border cursor-crosshair touch-none"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          {/* Initialize canvas on mount */}
          <CanvasInit onInit={initCanvas} />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={handlePredict}
            disabled={!hasDrawn || loading}
            className="flex-1 py-3 rounded-xl font-semibold text-primary-foreground gradient-button disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Predicting…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Predict
              </>
            )}
          </button>
          <button
            onClick={clearCanvas}
            className="px-5 py-3 rounded-xl font-semibold bg-secondary text-secondary-foreground border border-border hover:brightness-125 transition-all duration-200 flex items-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Preview */}
        {previewSrc && (
          <div className="mb-5 animate-in fade-in duration-300">
            <p className="text-xs text-muted-foreground mb-1">Sent to model:</p>
            <img
              src={previewSrc}
              alt="Canvas preview"
              className="w-16 h-16 rounded-lg border border-border"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Result */}
        {prediction && (
          <div className="mt-5 p-5 rounded-xl bg-primary/10 border border-primary/20 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-muted-foreground mb-1">Predicted Digit</p>
            <p className="text-5xl font-bold text-primary mb-3">{prediction.digit}</p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 flex-1 max-w-[160px] rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary">
                {prediction.confidence.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Confidence Score</p>
          </div>
        )}
      </div>
    </div>
  );
};

/** Tiny helper to run initCanvas once on mount */
function CanvasInit({ onInit }: { onInit: () => void }) {
  const ran = useRef(false);
  if (!ran.current) {
    ran.current = true;
    setTimeout(onInit, 0);
  }
  return null;
}

export default DigitRecognition;
