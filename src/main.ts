// tslint:disable-next-line:no-var-requires
require('dotenv').config();

import { Command } from 'commander';
import bootstrapApp from './apps/oauth2/main';
import bootstrapCli from './apps/cli/main';
import bootstrapInit from './apps/init/main';

async function bootstrap() {
  const program = new Command(process.env.NODE_UID);
  program.version(require('../package.json').version);

  program
  .command('cli')
  .description('CLI')
  .name('cli')
  .action(bootstrapCli);

  program
  .command('serve', { isDefault: true })
  .description('Start OAuth2 server')
  .name('serve')
  .action(bootstrapApp);

  program
  .command('init')
  .description('Run the init script (migrate and seed the DB)')
  .name('init')
  .action(bootstrapInit);

  await program.parseAsync(process.argv);
}
bootstrap();
