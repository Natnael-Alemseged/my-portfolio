import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Natnael Alemseged – AI Engineer & Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    width: '100%',
                    height: '100%',
                    padding: '60px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Left Side – Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src="/avatar_HD.png" // Updated image if you have higher-res
                        alt="Natnael Alemseged"
                        width={200}
                        height={200}
                        style={{
                            borderRadius: '9999px',
                            border: '4px solid #00ff99',
                        }}
                    />
                </div>

                {/* Right Side – Text and Tech Stack */}
                <div style={{ marginLeft: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 20 }}>
                        Natnael Alemseged
                    </div>
                    <div style={{ fontSize: 28, color: '#cbd5e1', marginBottom: 40 }}>
                        AI Engineer & Full-Stack Developer
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" />
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" width="48" />
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" width="48" />
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="48" />
                    </div>
                    <div style={{ marginTop: 40, fontSize: 20, color: '#94a3b8' }}>
                        natnaelalemseged.com
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
