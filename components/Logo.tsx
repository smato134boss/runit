export default function Logo({ size = 32, color = "#F97316", textColor = "#1C1917" }: {
  size?: number;
  color?: string;
  textColor?: string;
}) {
  const h = size;
  const w = Math.round(size * 1.25);
  const s = size / 32;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.28) }}>
      {/* Raccoon mask / checkmark icon */}
      <svg width={w} height={h} viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left eye — lower */}
        <rect x="1" y="17" width="15" height="10" rx="5" stroke={color} strokeWidth="2.6" />
        {/* Bridge */}
        <line x1="16" y1="22" x2="25" y2="10" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        {/* Right eye — higher */}
        <rect x="25" y="5" width="14" height="10" rx="5" stroke={color} strokeWidth="2.6" />
      </svg>

      {/* Wordmark */}
      <span style={{
        fontSize: size,
        fontWeight: 800,
        color: textColor,
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        Runly
      </span>
    </span>
  );
}
