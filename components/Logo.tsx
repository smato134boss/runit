export default function Logo({ size = 32, color = "#F97316", textColor = "#1C1917" }: {
  size?: number;
  color?: string;
  textColor?: string;
}) {
  const h = size;
  const w = Math.round(size * 1.7);
  const s = size / 32;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.28) }}>
      {/* Raccoon mask icon */}
      <svg width={w} height={h} viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left eye patch */}
        <rect x="1" y="5" width="19" height="18" rx="9" stroke={color} strokeWidth="2.6"/>
        {/* Right eye patch */}
        <rect x="28" y="5" width="19" height="18" rx="9" stroke={color} strokeWidth="2.6"/>
        {/* Nose bridge — slight downward curve (checkmark V) */}
        <path d="M20 12 Q24 20 28 12" stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
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
