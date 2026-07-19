# Video Engine Specification (NexusAuto)

## 1. Visão Geral
O objetivo deste módulo é dotar o NexusAuto da capacidade autônoma de gerar vídeos para três cenários distintos, utilizando arquiteturas adequadas para cada um:
1. **Vídeos Curtos para Apresentações (Image-to-Video):** Utilização da API da NVIDIA NIM (modelos generativos como o Stable Video Diffusion ou equivalentes da NVIDIA).
2. **Tutoriais Automáticos:** Geração programática de telas e fluxos. Para este cenário, devido à natureza sequencial de telas, uma arquitetura baseada em React renderizado programaticamente (como o Remotion) é muito mais precisa.
3. **Animação de Logos:** Utilização dos modelos generativos da NVIDIA focados em movimento/animação a partir de assets estáticos.

## 2. Arquitetura Proposta

O módulo será construído dentro do nosso Backend existente como o **Video Generation Engine**.

### 2.1 Componentes Principais
* **`NvidiaVideoClient`**: Cliente HTTP para comunicar com o NVIDIA NIM, utilizando a variável de ambiente `NVIDIA_API_KEY`.
* **`TutorialOrchestrator`** (Fase Posterior): Serviço responsável por renderizar cenários passo a passo programaticamente para os tutoriais (pode integrar-se ao Remotion posteriormente).
* **`VideoEngineService`**: Fachada (Facade) unificada que recebe o tipo do vídeo requerido, decide qual cliente usar, gerencia a requisição e lida com persistência.

### 2.2 Endpoints da API (Proposta)
* `POST /api/videos/generate/from-image`: Recebe o buffer da imagem de base e prompt, retorna um `.mp4` (para as apresentações).
* `POST /api/videos/generate/logo`: Recebe um asset de logo e prompt de animação, retorna a versão animada.
* `POST /api/videos/generate/tutorial`: Recebe um JSON de roteiro.

## 3. Fases de Implementação (Para GNHF / The Agency)

* **Fase 1: Infraestrutura e Integração NVIDIA (O que faremos agora)**
  - Adicionar suporte a `NVIDIA_API_KEY` na camada de configuração (`src/config/`).
  - Criar o `NvidiaVideoClient.ts` que consome a API da NVIDIA para Image-to-Video.
  - Implementar o `VideoEngineService.ts` conectando ao cliente.
  - Criar rota básica de teste `/api/videos/test-nvidia`.

* **Fase 2: Motor de Tutoriais (Remotion/Programático)**
  - Ficará como uma fase secundária caso os tutoriais não possam ser gerados apenas com texto+imagem pela NVIDIA, envolvendo pacotes extras para compilação visual.

## 4. Requisitos
* Variável `NVIDIA_API_KEY` configurada no `.env`.
* Gerenciamento de arquivos locais ou em cache (já que geração de vídeo é pesada e assíncrona, a API vai requerer _polling_ e salvamento do arquivo em disco/S3).
