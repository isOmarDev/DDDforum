export type Environment = 'development' | 'production' | 'staging' | 'ci';

export type Script = 'start' | 'test:unit' | 'test:e2e' | 'test:infra';

export class Config {
  public env: Environment;
  public script: Script;

  constructor(script: Script) {
    this.env = (process.env.NODE_ENV as Environment) || 'development';
    this.script = script;
  }
}
