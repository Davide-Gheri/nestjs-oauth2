import { BootstrapConsole } from 'nestjs-console';
import { Command } from 'commander';
import { CliModule } from './modules/cli/cli.module';

export default async function bootstrap(command: Command) {
  const boot = new BootstrapConsole({
    module: CliModule,
    useDecorators: true,
    contextOptions: {
      logger: ['error'],
    },
  });
  boot.init().then(async app => {
    try {
      await app.init();
      await boot.boot(['', '', ...command.args]);
      process.exit(0);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      process.exit(1);
    }
  });
}
