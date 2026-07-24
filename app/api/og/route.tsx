import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { siteConfig } from '@/config/site.config';

// Cache the OG images on the CDN level (and Next.js route segment level) for 24 hours.
// This prevents regenerating the same image on every crawler hit.
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || siteConfig.name;
    const type = searchParams.get('type') || 'Portfolio';

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
            backgroundColor: '#0a0a0a',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Accent decoration */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#a3a3a3',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '8px 24px',
              borderRadius: '9999px',
              marginBottom: '32px',
            }}
          >
            {type}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '48px',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#a3a3a3',
              fontSize: 32,
              fontWeight: 500,
              marginTop: 'auto',
            }}
          >
            {siteConfig.author} — {siteConfig.role}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`OG Image Generation Failed: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
