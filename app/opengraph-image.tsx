import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Na Mídia - Eventos + Bebidas Grátis';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #FFF7ED 100%)',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 165, 0, 0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.15)',
          }}
        />

        {/* Logo Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFA500',
            padding: '20px 40px',
            borderRadius: '20px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            Na Mídia
          </span>
        </div>

        {/* Main Heading */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: '#1F2937',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Eventos +
          </h1>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              color: '#FFA500',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Bebidas Grátis 🎉
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 36,
            color: '#6B7280',
            marginTop: '30px',
            marginBottom: '40px',
          }}
        >
          Confirme presença e ganhe cupom exclusivo
        </p>

        {/* Location Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFA500',
            padding: '15px 35px',
            borderRadius: '50px',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: 'white',
            }}
          >
            📍 Atibaia • SP
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
