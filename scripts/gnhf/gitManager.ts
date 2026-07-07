import simpleGit, { SimpleGit } from 'simple-git';

export class GitManager {
  private git: SimpleGit;

  constructor(baseDir: string) {
    this.git = simpleGit(baseDir);
  }

  async status() {
    return await this.git.status();
  }

  async commit(message: string) {
    await this.git.add('.');
    await this.git.commit(message);
  }

  async revertHard() {
    await this.git.reset(['--hard', 'HEAD']);
    await this.git.clean('f', ['-d']);
  }
}
