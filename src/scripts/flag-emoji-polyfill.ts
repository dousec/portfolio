/**
 * Country flag emoji polyfill for browsers that can't render them.
 *
 * Windows and Chromium-based browsers render flag emojis (regional
 * indicators) as two-letter codes like "US" instead of an actual flag.
 * This script detects that and injects a self-hosted subset of the Twemoji
 * Mozilla color font ("Twemoji Country Flags", ~78KB woff2) — but only on
 * browsers that need it, so macOS/iOS/etc. keep their native flags.
 *
 * Adapted from talkjs/country-flag-emoji-polyfill (MIT)
 * https://github.com/talkjs/country-flag-emoji-polyfill
 * Font: https://github.com/mozilla/twemoji-colr (Twemoji, CC-BY 4.0)
 */

const FONT_NAME = 'Twemoji Country Flags';
const FONT_URL = '/fonts/TwemojiCountryFlags.woff2';

const FONT_FAMILY =
  '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",' +
  '"Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';

function makeCtx(): CanvasRenderingContext2D | null {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.textBaseline = 'top';
  ctx.font = `100px ${FONT_FAMILY}`;
  ctx.scale(0.01, 0.01);
  return ctx;
}

function getColor(ctx: CanvasRenderingContext2D, text: string, color: string) {
  ctx.clearRect(0, 0, 100, 100);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);

  const bytes = ctx.getImageData(0, 0, 1, 1).data;
  return bytes.join(',');
}

function supportsEmoji(text: string) {
  const ctx = makeCtx();
  if (!ctx) return false;
  const white = getColor(ctx, text, '#fff');
  const black = getColor(ctx, text, '#000');

  return black === white && !black.startsWith('0,0,0,');
}

function polyfillCountryFlagEmojis(): boolean {
  if (
    typeof window !== 'undefined' &&
    supportsEmoji('😊') &&
    !supportsEmoji('🇨🇭')
  ) {
    const style = document.createElement('style');
    style.textContent = `@font-face {
  font-family: "${FONT_NAME}";
  src: url('${FONT_URL}') format('woff2');
  font-display: swap;
  unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067,
    U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
}`;
    document.head.appendChild(style);
    return true;
  }
  return false;
}

polyfillCountryFlagEmojis();
