import { Command, Console } from 'nestjs-console';
import { ConfigService } from '@nestjs/config';
import commander from 'commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '@app/entities';
import { Repository } from 'typeorm';
import { CipherService, RS256Generator } from '@app/lib/cipher';
import forge from 'node-forge';

@Console({
  name: 'keys',
  description: 'Manage keys',
})
export class KeysService {
  constructor(
    private readonly config: ConfigService,
    private readonly cipher: CipherService,
    private readonly rs256generator: RS256Generator,
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}

  @Command({
    command: 'new <name>',
    description: 'Create a new rs256 key pair',
    options: [
      {
        flags: '-o, --output',
        description: 'Specify output folder',
      },
    ],
  })
  async createKeyPair(name: string, command: commander.Command) {
    const { output } = command.opts();

    const keyPair = await this.rs256generator.generateKeyPair();
    if (output) {
      await this.rs256generator.persist(keyPair, output, `${name}-pub.key`, `${name}-priv.key`);
    } else {
      const pubKey = this.keyRepository.create({
        name,
        type: 'public',
        data: this.cipher.encrypt(forge.pki.publicKeyToPem(keyPair.publicKey)),
      });
      const privKey = this.keyRepository.create({
        name,
        type: 'private',
        data: this.cipher.encrypt(forge.pki.privateKeyToPem(keyPair.privateKey)),
      });
      await this.keyRepository.save([pubKey, privKey]);

      console.log('Public:', pubKey.id);
      console.log('Private:', privKey.id);
    }
    console.log('Key pair created');
  }
}
