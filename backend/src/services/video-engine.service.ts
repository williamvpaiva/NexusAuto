import { InternalVideoClient } from './video-client';

export class VideoEngineService {
  private videoClient: InternalVideoClient;

  constructor() {
    this.videoClient = new InternalVideoClient();
  }

  /**
   * Ponto de entrada da Fachada (Facade) para geração de vídeos.
   */
  async generateVideoFromImage(imagePath: string, prompt: string): Promise<string> {
    try {
      console.log(`[VideoEngineService] Lendo imagem de base: ${imagePath}`);
      // Lógica de leitura da imagem
      const base64Image = 'base64_mock'; // fs.readFileSync(imagePath, 'base64');

      console.log(`[VideoEngineService] Solicitando vídeo com prompt: "${prompt}"`);
      const outputVideoPath = await this.videoClient.generateImageToVideo(base64Image, prompt);

      console.log(`[VideoEngineService] Vídeo gerado com sucesso: ${outputVideoPath}`);
      return outputVideoPath;
    } catch (error) {
      console.error('[VideoEngineService] Erro ao gerar vídeo:', error);
      throw error;
    }
  }

  async generateTutorial(scriptJson: any): Promise<string> {
    console.log('[VideoEngineService] Gerando tutorial via orquestração programática (Remotion/React)...');
    // Integração futura com o Remotion conforme Fase 2 do plan.md
    return 'tutorial_render.mp4';
  }
}
