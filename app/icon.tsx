import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            fill="none"
            stroke="#263238"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="16.01,1.5 7.62,16.23 16.01,21.5 24.38,16.18"
          />
          <line
            stroke="#263238"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            x1="16.01"
            x2="16.01"
            y1="30.5"
            y2="24.1"
          />
          <polygon
            fill="none"
            stroke="#263238"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="16.01,30.5 7.62,18.83 16.01,24.1 24.38,18.78"
          />
          <polygon
            fill="none"
            stroke="#263238"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="16.01,12.3 7.62,16.23 16.01,21.5 24.38,16.18"
          />
          <line
            stroke="#263238"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            x1="16.01"
            x2="16.01"
            y1="1.5"
            y2="21.5"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
