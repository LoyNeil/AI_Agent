import { useEffect, useMemo, useState } from "react";

export default function LoaderOverlay({ open, totalSeconds = 100, onDone }) {
  const steps = useMemo(
    () => [
      { at: 0, text: "File is getting uploaded" },
      { at: 5, text: "AI is checking the menu" },
      { at: 10, text: "AI is getting the spices ready" },
      { at: 15, text: "AI has started preparing the dish" },
      { at: 17, text: "It is now ready to be served" },
    ],
    []
  );

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [currentText, setCurrentText] = useState(steps[0].text);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(totalSeconds);
    setCurrentText(steps[0].text);
  }, [open, totalSeconds, steps]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;

        const elapsed = totalSeconds - Math.max(next, 0);
        const active =
          [...steps].reverse().find((s) => elapsed >= s.at) || steps[0];
        setCurrentText(active.text);

        if (next <= 0) {
          clearInterval(interval);
          onDone?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, totalSeconds, steps, onDone]);

  if (!open) return null;

  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-lg border border-[#00FF66]/40 rounded-2xl p-6 bg-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[#00FF66] text-xl font-bold drop-shadow-[0_0_8px_#00FF66]">
              Cooking up your SOP…
            </h2>
            <p className="mt-2 text-[#39FF14]">{currentText}</p>
          </div>

          <div className="text-right">
            <div className="text-[#00FF66] font-semibold tabular-nums">
              {secondsLeft}s
            </div>
            <div className="text-xs text-[#39FF14]/70">remaining</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,#00ff66,#00ffa3)",
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[#39FF14]/70">
            <span>{progress}%</span>
            <span>AI chef mode</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[#00FF66] animate-pulse" />
          <p className="text-xs text-[#39FF14]/70">
            Please don’t close this window while we generate the SOP.
          </p>
        </div>
      </div>
    </div>
  );
}