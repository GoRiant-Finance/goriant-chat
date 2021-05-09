const anchor = require("@project-serum/anchor");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let provider = anchor.Provider.local();
anchor.setProvider(provider);
let isChat = true;
// Program client handle.

const idl = JSON.parse(require('fs').readFileSync('./target/idl/chat.json', 'utf8'));

// Address of the deployed program.
const programId = new anchor.web3.PublicKey("Bqh7rY5BNZTkQBYHWTgm7cuRBsPUiQChJaTD4ry3Z9B4");

// Generate the program client from IDL.
const program = new anchor.Program(idl, programId);

// let chatPool = new anchor.web3.PublicKey();
let chatRoom = new anchor.web3.Account();

async function main() {
    await create_room(program, chatRoom);
    await create_user(program);
}

async function create_room(program, chatRoom) {
    let chat_tran = await program.rpc.createChatRoom("Test Chat", {
        accounts: {
            chatRoom: chatRoom.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        instructions: [
            await program.account.chatRoom.createInstruction(chatRoom),
        ],
        signers: [chatRoom],
    });
    console.log("chat_tran:", chat_tran);
}

async function create_user(program) {
    const authority = program.provider.wallet.publicKey;
    let user_tran = await program.rpc.createUser("My User", {
        accounts: {
            user: await program.account.user.associatedAddress(authority),
            authority,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
    });
    console.log("user_tran:", user_tran);
    const account = await program.account.user.associated(authority);

}

async function sendMessage(program, chatRoom, messages) {
    const authority = program.provider.wallet.publicKey;
    const user = await program.account.user.associatedAddress(authority);
    let msg_tran = await program.rpc.sendMessage(messages, {
        accounts: {
            user,
            authority,
            chatRoom: chatRoom.publicKey,
        },
    });
    // console.log("msg_tran:", msg_tran);
}

async function readMessage(program, chatRoom, next) {
    const chat = await program.account.chatRoom(chatRoom.publicKey);
    let msg = chat.messages[next];
    let data = null;
    let from = null;
    if (msg && !msg.from.equals(anchor.web3.PublicKey.default)) {
        from = msg.from.toString();
        data = new TextDecoder("utf-8").decode(new Uint8Array(msg.data));
    }
    return {from: from, msg: data};
}
async function msgReader() {
    let i = 0;
    const authority = program.provider.wallet.publicKey;
    console.log(authority.toString());
    while (isChat){
        let {from, msg} = await readMessage(program, chatRoom, i);
        if (from && from != authority.toBase58()) {
            i++;
            console.info("\t\tfrom: " + from);
            console.info("\t\t\t\t", msg);
        }
    }
}
async function msgSender() {
    for await (const command of rl) {
        if (command === "exit") {
            console.log("Exit chat!");
            isChat = false;
            rl.close();
            return;
        }
        if (command) {
            await sendMessage(program, chatRoom, command);
        }
    }
}
console.log('Running client.');
main().then(() => {
    msgReader();
    msgSender();
});