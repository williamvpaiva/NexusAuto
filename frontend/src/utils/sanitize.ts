import DOMPurify from 'dompurify';

/**
 * Configura DOMPurify para sanitização de HTML
 */
export function configureDOMPurify() {
  DOMPurify.setConfig({
    ALLOWED_TAGS: [
      'p', 'br', 'div', 'span',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'class', 'id', 'src', 'alt'
    ],
    ADD_ATTR: ['target'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
}

/**
 * Escapa texto simples para prevenir XSS
 * Converte caracteres especiais em entidades HTML
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitiza HTML permitindo apenas tags e atributos seguros
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}

/**
 * Sanitiza URL para prevenir javascript: e outros protocolos perigosos
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const validProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    
    if (!validProtocols.includes(parsed.protocol)) {
      console.warn('[Sanitize] Protocolo de URL não permitido:', parsed.protocol);
      return '#';
    }
    
    return url;
  } catch {
    console.warn('[Sanitize] URL inválida:', url);
    return '#';
  }
}