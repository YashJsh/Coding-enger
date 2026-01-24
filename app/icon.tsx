import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div 
        style={{
          fontSize: 20,
          background: "transparent", 
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black", // Or use your brand color like '#3b82f6'
          fontWeight: 900,
        }}
      >
        {/* We use specific character codes to ensure it renders cleanly */}
        &lt;/&gt;
      </div>
    ),
    {
      ...size,
    }
  );
}