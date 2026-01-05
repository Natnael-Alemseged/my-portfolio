import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Natnael Alemseged – AI Engineer & Full-Stack Developer';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    // Generate the image using ImageResponse
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
                {/* Simplified content to ensure it renders */}
                <div style={{
                    display: 'flex',
                    fontSize: 80,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: '#00ff99'
                }}>
                    Natnael Alemseged
                </div>
                <div style={{
                    display: 'flex',
                    fontSize: 40,
                    color: '#cbd5e1'
                }}>
                    AI Engineer & Full-Stack Developer
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: 60,
                    fontSize: 24,
                    color: '#94a3b8'
                }}>
                    natnaelalemseged.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
