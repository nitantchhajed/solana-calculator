const assert = require("assert");
const anchor = require("@coral-xyz/anchor");
import { Program } from "@coral-xyz/anchor";
import { Mycalculator } from "../target/types/mycalculator";

const { SystemProgram } = anchor.web3;
 
describe("mycalculatordapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
 
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculator as Program<Mycalculator>;
 
  it("Create a calculator", async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [calculator]
    });
 
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting == "Welcome to Solana")
  })

  it("Addition of numbers", async () => {
    const num1 = new anchor.BN(10);
    const num2 = new anchor.BN(5);
    await program.methods.add(num1, num2)
      .accounts({
        calculator: calculator.publicKey
      })
      .rpc();
 
    const account = await program.account.calculator.fetch(calculator.publicKey);
    console.log({account});
    
  })

})