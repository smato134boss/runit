"use client";

export default function Logo({ size = 26, light = false }: { size?: number; light?: boolean }) {
  const textColor = light ? "#FFFFFF" : "#1C1917";
  const tailOrange = "#F97316";
  const tailDark = light ? "#FFFFFF" : "#44403C";
  const scale = size / 26;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 1 }}>
      {/* RUNL in bold */}
      <span style={{
        fontSize: size,
        fontWeight: 800,
        color: textColor,
        letterSpacing: "-1px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        lineHeight: 1,
      }}>
        RUNL
      </span>

      {/* Custom Y with raccoon tail curling right */}
      <svg
        width={Math.round(42 * scale)}
        height={Math.round(32 * scale)}
        viewBox="0 0 42 32"
        fill="none"
        style={{ display: "block" }}
      >
        {/* Y — left arm */}
        <line x1="2"  y1="1" x2="14" y2="18" stroke={textColor} strokeWidth="3.2" strokeLinecap="round"/>
        {/* Y — right arm */}
        <line x1="26" y1="1" x2="14" y2="18" stroke={textColor} strokeWidth="3.2" strokeLinecap="round"/>

        {/*
          Raccoon tail replaces Y stem.
          Starts at Y center (14,18), dips slightly, then curves right and UP
          forming a recognizable curling tail — stays within the letter height.
        */}
        {/* Orange tail base with dark stripe rings via dasharray */}
        <path
          d="M14,18 C14,25 20,30 28,28 C36,26 41,19 38,14 C36,11 32,11 31,14"
          stroke={tailOrange}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5.5 4"
        />
        {/* Dark stripes — offset so they land in the gaps */}
        <path
          d="M14,18 C14,25 20,30 28,28 C36,26 41,19 38,14 C36,11 32,11 31,14"
          stroke={tailDark}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 5.5"
          strokeDashoffset="5.5"
        />
      </svg>
    </span>
  );
}
