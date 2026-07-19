---
name: hyperframes
description: "Criação de vídeos MP4 a partir de HTML com Hyperframes (HeyGen)"
metadata:
  cow:
    emoji: "🎬"
---

# Hyperframes — Criação de Vídeos via HTML

Skill para gerar vídeos MP4 profissionais a partir de HTML, CSS e animações usando o framework open-source [Hyperframes](https://github.com/heygen-com/hyperframes) (HeyGen).

## Quando Usar

- Criar vídeo de lançamento/demo de um produto SaaS
- Gerar walkthrough animado de features
- Produzir PR-to-video com diffs animados
- Criar data visualization animada / chart race
- Fazer vídeos faceless explainer (sem rosto) para marketing
- Adicionar captions/subtitles a vídeos existentes
- Gerar motion graphics curtos (intros, stings, lower-thirds)

## Pré-requisitos

```bash
node -v  # >= 22
```

FFmpeg instalado:
```bash
# Verificar
ffmpeg -version
```

## Fluxo de Trabalho

### 1. Iniciar Projeto

```bash
npx hyperframes init meu-video
cd meu-video
```

Isso cria um projeto com `index.html` e `package.json`.

### 2. Escrever a Composição (HTML)

Use HTML puro com `data-*` attributes para timing. Estrutura básica:

```html
<div id="stage" data-composition-id="meu-video" data-start="0" data-width="1920" data-height="1080">
  <!-- Mídia: vídeos, áudios -->
  <video class="clip" data-start="0" data-duration="10" data-track-index="0" src="bg.mp4" muted playsinline></video>
  <audio data-start="0" data-duration="10" data-track-index="1" data-volume="0.5" src="music.wav"></audio>

  <!-- Texto animado -->
  <h1 class="clip" data-start="1" data-duration="8" data-track-index="2">Título Aqui</h1>

  <!-- Animações (GSAP, CSS, Anime.js, Lottie, Three.js) -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("h1", { opacity: 0, y: 40, duration: 0.8 }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines["meu-video"] = tl;
  </script>
</div>
```

### 3. Preview

```bash
npx hyperframes preview
```

Abre no navegador com live reload.

### 4. Renderizar

```bash
npx hyperframes render
```

Gera um MP4 deterministico.

## Atributos Essenciais

| Atributo | Obrigatório | Descrição |
|----------|-------------|-----------|
| `data-composition-id` | Sim | ID único da composição |
| `data-width` / `data-height` | Sim | Resolução (ex: 1920x1080) |
| `data-start` | Sim | Início em segundos |
| `data-duration` | Sim | Duração em segundos |
| `data-track-index` | Sim | Ordem da track (0-based) |
| `class="clip"` | Sim | Marca elemento como parte da composição |

## Criativos Pré-Prontos (frame.md)

O Hyperframes oferece templates de design (`frame.md`) que invertem design systems para o formato de vídeo. Acesse em:
- https://www.hyperframes.dev/design

Template de `frame.md`:
```markdown
# Frame.md — [Nome do Projeto]

## Canvas
- Resolução: 1920x1080
- Frame rate: 30fps
- Duração: 30s

## Paleta
- Primary: #HEX
- Secondary: #HEX
- Background: #HEX
- Text: #HEX

## Tipografia
- Display: "Font Name"
- Body: "Font Name"

## Grid
- Safe area: 120px padding
- Grid columns: 12
- Gutter: 24px
```

## Skills do Hyperframes (Carregamento Sob Demanda)

O Hyperframes tem 19 skills especializadas que agentes podem carregar:

### Router (leia primeiro para qualquer request de vídeo)
- `/hyperframes` — Capability map + intent router

### Creation Workflows
- `/product-launch-video` — Vídeo de produto a partir de URL/brief/script
- `/faceless-explainer` — Vídeo explicativo sem rosto (tipografia/diagramas)
- `/pr-to-video` — Transforma PR em vídeo explicativo
- `/embedded-captions` — Adiciona legendas a vídeo existente
- `/talking-head-recut` — Overlays gráficos em vídeo de entrevista/podcast
- `/motion-graphics` — Motion graphic curto (<10s)
- `/music-to-video` — Vídeo beat-synced a partir de música
- `/slideshow` — Apresentação/deck navegável
- `/general-video` — Fallback para qualquer outro tipo

### Domain Skills
- `/hyperframes-core` — Contrato de composição (atributos data-*)
- `/hyperframes-animation` — Regras de animação + adaptadores
- `/hyperframes-keyframes` — Keyframes seek-safe
- `/hyperframes-creative` — Direção criativa (paletas, tipografia, narrativa)
- `/media-use` — Resolução de mídia (BGM, SFX, TTS, imagens)
- `/hyperframes-cli` — CLI dev loop (init, lint, check, preview, render)
- `/hyperframes-registry` — Instalação de blocos/blocks do catálogo
- `/figma` — Importação de assets do Figma

### Instalação seletiva:

```bash
# Instalar router + workflows core
npx hyperframes skills update

# Instalar skill específica (ex: product-launch-video)
npx skills add heygen-com/hyperframes --skill product-launch-video --full-depth
```

## Catálogo de Blocos

Blocos prontos para overlays, transições, charts e mais:

```bash
npx hyperframes add flash-through-white   # transição shader
npx hyperframes add instagram-follow      # overlay social
npx hyperframes add data-chart            # gráfico animado
```

Catálogo completo: https://hyperframes.heygen.com/catalog

## Renderização em Nuvem (AWS Lambda)

Para projetos maiores sem depender da máquina local:

```bash
npx hyperframes lambda deploy
npx hyperframes lambda render meu-video
```

## Integração com NexusAuto

### Como ativar no fluxo /lider

Quando o Tech Lead identificar que a tarefa envolve criação de vídeo:

1. Tech Lead carrega esta skill (`skills/hyperframes/SKILL.md`)
2. Identifica o tipo de vídeo necessário (product-launch, explainer, PR, etc.)
3. Delega para o **Product Marketer Agent** ou **Executor Agent** com as instruções
4. O agente segue o fluxo: `init` → escreve HTML → `preview` → `render`
5. Resultado: `.mp4` salvo em `assets/videos/`

### Pipeline típica para vídeo de produto

```bash
# 1. Iniciar projeto Hyperframes
npx hyperframes init assets/videos/demo-product
cd assets/videos/demo-product

# 2. Editar index.html com a composição do vídeo

# 3. Preview
npx hyperframes preview

# 4. Renderizar
npx hyperframes render

# 5. Registrar na memória do NexusAuto
node .ai-factory/scripts/memory-manager.js save \
  "Vídeo de demo gerado em assets/videos/demo-product/output.mp4" \
  --agent product-marketer --type general --tags video,hyperframes,demo
```

### Exemplo: Product Launch Video

```html
<div id="stage" data-composition-id="launch" data-start="0" data-width="1920" data-height="1080">
  <!-- Background com gradiente -->
  <div style="position:absolute;width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2)"></div>

  <!-- Título com fade-in -->
  <h1 class="clip" data-start="0.5" data-duration="4" data-track-index="0"
      style="color:white;font-family:sans-serif;font-size:72px;text-align:center;top:40%">
    Product Name
  </h1>

  <!-- Subtítulo -->
  <p class="clip" data-start="2" data-duration="6" data-track-index="1"
     style="color:rgba(255,255,255,0.8);font-size:32px;text-align:center;top:55%">
    The future of [category]
  </p>

  <!-- CTA -->
  <p class="clip" data-start="6" data-duration="4" data-track-index="2"
     style="color:#fff;font-size:24px;text-align:center;top:70%;border:2px solid #fff;padding:12px 32px;display:inline-block">
    Get Started →
  </p>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("h1", { opacity: 0, y: -30, duration: 0.8 }, 0);
    tl.from("p", { opacity: 0, y: 20, duration: 0.6 }, 0.5);
    window.__timelines = window.__timelines || {};
    window.__timelines.launch = tl;
  </script>
</div>
```

## Boas Práticas

- **Determinismo**: Mesmo HTML = mesmo MP4. Ideal para CI/CD.
- **Mídia local**: Use arquivos locais ou URLs (sem DRM)
- **Animações**: Sempre usar timelines seekable (`paused: true`)
- **Track indexes**: Não pule números (0, 1, 2...)
- **Áudio**: Use `data-volume` para controle de nível
- **Cores**: Prefira hex/rgb — evite named colors
- **Design**: Crie um `frame.md` antes para guiar a composição

## Links Úteis

- Repositório: https://github.com/heygen-com/hyperframes
- Docs: https://hyperframes.heygen.com/introduction
- Playground: https://www.hyperframes.dev/
- Showcase: https://hyperframes.heygen.com/showcase
- Catálogo de blocos: https://hyperframes.heygen.com/catalog
- Design templates: https://www.hyperframes.dev/design
- Discord: https://discord.gg/EbK98HBPdk

---

**Versão:** 1.0.0
**Autor:** NexusAuto AI Factory
**Última Atualização:** Julho 2026
