import {Program, Provider, setProvider, web3} from "@project-serum/anchor";
import {Wallet} from "@project-serum/anchor/src/provider";
import {Connection} from "@solana/web3.js";
import config from './config.json';
import idl from './chat_idl.json';

const CHAT_PROGRAM_ID = config.programId;

export default class ChatClient {

  async createNewUser(userName: string, connection: Connection, wallet: Wallet) {
    let provider = new Provider(connection, wallet, Provider.defaultOptions());
    setProvider(provider);

    const programId = new web3.PublicKey(CHAT_PROGRAM_ID);
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

  async createNewChatRoom(roomName: string, connection: Connection, wallet: Wallet) {
    let provider = new Provider(connection, wallet, Provider.defaultOptions());
    setProvider(provider);
    const programId = new web3.PublicKey(CHAT_PROGRAM_ID);
    const program = new Program(JSON.parse(JSON.stringify(idl)), programId);

    const chatRoom = new web3.Account();

    let txn = await program.rpc.createChatRoom(roomName, {
      accounts: {
        chatRoom: chatRoom.publicKey,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      instructions: [
        await program.account.chatRoom.createInstruction(chatRoom),
      ],
      signers: [chatRoom],
    });

    alert('Chat room was creating for Account: ' + chatRoom.publicKey);

    console.log('Chat room was created with txn:', txn);

    const chat = await program.account.chatRoom(chatRoom.publicKey);
    const name = new TextDecoder("utf-8").decode(new Uint8Array(chat.name));

    console.log('Chat room name read from Solana blockchain: ', name);
  }
}
