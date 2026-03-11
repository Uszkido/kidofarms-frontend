import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Kido Farms Network';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #09311b, #155c32)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '80px',
                }}
            >
                {/* Decorative Leaf-like Element */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 120,
                            fontWeight: 900,
                            fontFamily: 'serif',
                            letterSpacing: '-0.05em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 0,
                        }}
                    >
                        <span style={{ fontStyle: 'italic', color: '#ffc107', marginRight: '30px' }}>KIDO</span> FARMS
                    </div>

                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 600,
                            opacity: 0.9,
                            textAlign: 'center',
                            maxWidth: '900px',
                            lineHeight: 1.4,
                            marginTop: '20px',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Farm Fresh. Delivered.
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 400,
                            opacity: 0.7,
                            textAlign: 'center',
                            marginTop: '40px',
                            padding: '16px 32px',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '100px',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Nigeria's most trusted digital farm marketplace
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
