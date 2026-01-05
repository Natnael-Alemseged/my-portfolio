import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Natnael Alemseged – AI Engineer & Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a',
                    width: '100%',
                    height: '100%',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
                    Natnael Alemseged
                </div>
                <div style={{ fontSize: 30, color: '#00ff99' }}>
                    AI Engineer & Full-Stack Developer
                </div>
                <div style={{ marginTop: 40, fontSize: 20, color: '#94a3b8' }}>
                    natnaelalemseged.com
                </div>
            </div>
        ),
        { ...size }
    );
}
