#!/usr/bin/env python3
"""
UI/UX Pro Max Wrapper - NexusAuto
Wrapper Python para o módulo UI/UX Pro Max

Este script chama o módulo UI/UX Pro Max e retorna o resultado em JSON.
"""

import sys
import json
import os

# Adiciona o caminho do módulo ao PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'ui-ux-pro-max'))

def main():
    # Lê o argumento (descrição do projeto)
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Descrição do projeto é obrigatória"}))
        sys.exit(1)
    
    description = " ".join(sys.argv[1:])
    
    try:
        # Tenta importar o módulo UI/UX Pro Max
        from core import DesignSystemGenerator
        
        generator = DesignSystemGenerator()
        result = generator.generate(description)
        
        # Valida se o resultado tem todas as seções obrigatórias
        required_fields = ['layout', 'palette', 'typography', 'css_effects', 'anti_patterns', 'checklist']
        missing_fields = [field for field in required_fields if field not in result]
        
        if missing_fields:
            result['warning'] = f"Campos ausentes: {', '.join(missing_fields)}"
        
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    except ImportError as e:
        # Módulo não disponível - retorna resposta mockada para desenvolvimento
        mock_result = {
            "layout": {
                "pattern": "Hero + Features + CTA + Footer",
                "sections": [
                    {"name": "Hero", "description": "Título impactante + subtítulo + CTA principal"},
                    {"name": "Features", "description": "3-4 cards com ícones e descrições curtas"},
                    {"name": "CTA", "description": "Chamada final com formulário de captura"},
                    {"name": "Footer", "description": "Links, copyright e redes sociais"}
                ]
            },
            "palette": {
                "primary": {"hex": "#2C3E50", "name": "Deep Blue", "usage": "Botões, links, títulos"},
                "secondary": {"hex": "#8E8E8E", "name": "Gray", "usage": "Texto secundário, bordas"},
                "accent": {"hex": "#E8D5C4", "name": "Beige", "usage": "Destaques, hover states"},
                "background": {"hex": "#FFFFFF", "name": "White", "usage": "Fundos principais"},
                "surface": {"hex": "#F8F9FA", "name": "Light Gray", "usage": "Cards, seções alternadas"}
            },
            "typography": {
                "headings": {
                    "font": "Playfair Display",
                    "weights": [700, 600],
                    "sizes": {"h1": "48px", "h2": "36px", "h3": "24px", "h4": "20px"}
                },
                "body": {
                    "font": "Lato",
                    "weights": [400, 500],
                    "sizes": {"base": "16px", "small": "14px", "large": "18px"}
                },
                "code": {
                    "font": "JetBrains Mono",
                    "weights": [400],
                    "sizes": {"base": "14px"}
                },
                "scale": ["12px", "14px", "16px", "20px", "24px", "32px", "48px"]
            },
            "css_effects": [
                "Sombra suave: box-shadow: 0 2px 8px rgba(0,0,0,0.1)",
                "Transições: transition: all 300ms ease-in-out",
                "Hover states: transform: translateY(-2px)",
                "Overlays com gradiente: linear-gradient(135deg, ...)",
                "Border-radius: 8px (botões), 12px (cards)"
            ],
            "anti_patterns": [
                "Evitar cores vibrantes demais (saturação > 80%)",
                "Não usar mais de 3 fontes diferentes",
                "Evitar animações que duram mais de 500ms",
                "Não usar texto com contraste < 4.5:1",
                "Evitar larguras de linha > 80 caracteres"
            ],
            "checklist": [
                "✅ Acessibilidade: WCAG 2.1 AA (contraste, navegação por teclado)",
                "✅ Responsividade: Mobile-first, breakpoints em 640px, 768px, 1024px",
                "✅ Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms",
                "✅ SEO: Meta tags, headings hierárquicos, alt text em imagens",
                "✅ Forms: Validação em tempo real, mensagens de erro claras"
            ],
            "mock": True,
            "mock_reason": "Módulo UI/UX Pro Max não disponível. Retornando resposta mockada para desenvolvimento."
        }
        print(json.dumps(mock_result, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": str(e), "type": type(e).__name__}))
        sys.exit(1)

if __name__ == "__main__":
    main()