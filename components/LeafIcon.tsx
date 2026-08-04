export default function LeafIcon({
  size = 24,
  className = "",
  fill = "#2D6A4F",
}: {
  size?: number;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      className={className}
    >
      {/* Main leaf branch */}
      <path
        d="M50 10 Q55 30 50 50 Q45 30 50 10"
        fill={fill}
        opacity="0.9"
      />
      {/* Top leaf right */}
      <path
        d="M50 30 Q70 25 75 35 Q65 40 50 40"
        fill={fill}
        opacity="0.85"
      />
      {/* Top leaf left */}
      <path
        d="M50 40 Q30 35 25 45 Q35 50 50 48"
        fill={fill}
        opacity="0.85"
      />
      {/* Middle leaf right */}
      <path
        d="M50 50 Q75 48 78 58 Q65 62 50 58"
        fill={fill}
        opacity="0.8"
      />
      {/* Middle leaf left */}
      <path
        d="M50 58 Q25 56 22 66 Q35 70 50 66"
        fill={fill}
        opacity="0.8"
      />
      {/* Bottom leaf right */}
      <path
        d="M50 68 Q72 68 74 76 Q62 78 50 76"
        fill={fill}
        opacity="0.75"
      />
      {/* Bottom leaf left */}
      <path
        d="M50 76 Q28 76 26 84 Q38 86 50 84"
        fill={fill}
        opacity="0.75"
      />
      {/* Stem */}
      <path
        d="M50 10 Q48 50 50 90 Q52 100 50 110"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
