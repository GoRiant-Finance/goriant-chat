import {Program, Provider, setProvider, web3} from "@project-serum/anchor";
import {Wallet} from "@project-serum/anchor/src/provider";
import {Connection} from "@solana/web3.js";
import idl from './chat_idl.json';

export default class ChatClient {

  async createNewUser(userName: string, connection: Connection, wallet: Wallet) {
    console.log(idl);

    let provider = new Provider(connection, wallet, Provider.defaultOptions());

    setProvider(provider);

    const programId = new web3.PublicKey("6BPUw74YU1JvZ6aXvinejJMVxyqa2ZErooHEF3DJTSvv");
    const program = new Program(JSON.parse(JSON.stringify(idl)), programId);

    const authority = program.provider.wallet.publicKey;

    alert("New user name was created: " + userName)

    let txn = await program.rpc.createUser(userName, {
      accounts: {
        user: await program.account.user.associatedAddress(authority),
        authority,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
    });

    console.log(txn);

    const account = await program.account.user.associated(authority);
    console.log('User name: ', account.name);
    console.log('Authority: ', account.authority);

  }
}
