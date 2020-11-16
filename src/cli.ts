import { BootstrapConsole } from 'nestjs-console';
import { CliModule } from './modules/cli/cli.module';

async function bootstrap() {
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
      await boot.boot(process.argv);
      process.exit(0);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      process.exit(1);
    }
  });
}
bootstrap();
