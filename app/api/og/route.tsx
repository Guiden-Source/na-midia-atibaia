import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'Na Mídia';
    const date = searchParams.get('date') || '';
    const location = searchParams.get('location') || 'Atibaia - SP';
    const type = searchParams.get('type') || 'Evento';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #EC4899 100%)',
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}
        >
          {/* Efeito de fundo */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Conteúdo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Badge do tipo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '50px',
                padding: '16px 32px',
                marginBottom: '40px',
                fontSize: '28px',
                fontWeight: '700',
                color: '#FF6B35',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              }}
            >
              {type.toUpperCase()}
            </div>

            {/* Título */}
            <div
              style={{
                display: 'flex',
                fontSize: '72px',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                lineHeight: 1.2,
                marginBottom: '30px',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Data e Local */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                fontSize: '32px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  📅 {date}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                📍 {location}
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                display: 'flex',
                marginTop: '60px',
                background: 'white',
                borderRadius: '50px',
                padding: '24px 48px',
                fontSize: '32px',
                fontWeight: '700',
                color: '#FF6B35',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              🍹 Confirme presença e ganhe cupom!
            </div>
          </div>

          {/* Logo no rodapé */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '36px',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Na Mídia
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Erro ao gerar OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
