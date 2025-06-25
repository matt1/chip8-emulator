import { Tickable } from "./common.js";
import { Chip8Display } from "./display.js";
import { Chip8Emulator } from "./emulator.js";
import { Chip8Memory } from "./memory.js";
import { Chip8Registers } from "./registers.js";

export class Chip8Cpu implements Tickable {

  constructor(
    private readonly registers:Chip8Registers,
    private readonly ram:Chip8Memory,
    private readonly gpu: Chip8Display
  ) {
    console.log('Initialising CPU');
    this.init();
  }

  init() {

  }

  tick() {
    const instruction = this.fetch();
    const nibbles = this.decode(instruction);
    this.execute(nibbles, instruction);
  }

  fetch():number {
    const instruction = this.ram.readWord(this.registers.pc);
    this.registers.pc += 2;
    return instruction;
  }

  decode(instruction:number): Array<number> {
    const nibble1 = 0xf000
    const nibble2 = 0x0f00
    const nibble3 = 0x00f0
    const nibble4 = 0x000f
    return [
      (instruction & nibble1) >> 12,
      (instruction & nibble2) >> 8,
      (instruction & nibble3) >> 4,
      instruction & nibble4,
      
    ]
  }

  execute(nibbles:Array<number>, instruction:number) {
    try {
        switch (nibbles[0]) {
            case 0x0:
            if (nibbles[1] === 0x0 && nibbles[2] === 0xe && nibbles[3] === 0x0) {
                // 00E0 - clear display
                this.gpu.clear();
                break;
            } else if (nibbles[1] === 0x0 && nibbles[2] === 0xe && nibbles[3] === 0xe) {
                // 00EE - return form stack pointer
                this.registers.pc = this.ram.popStack();
            } else {
                throw new Error(`Unsupported 0x0 instruction ${Chip8Emulator.toHex(instruction, 4)}`);
            }
            case 0xA:
            // Annn - set I to nnn
            let i = 0;
            i |= nibbles[1] << 8;
            i |= nibbles[2] << 4;
            i |= nibbles[3] << 0;
            this.registers.i = i;
            break;
            case 0x6:
            // 6xnn - set Vx to nn
            let n =0;
            n |= nibbles[2] << 4;
            n |= nibbles[3] << 0;
            this.registers.v[nibbles[1]] = n;
            break;
        default:
            console.error(`Unsupported opcode nibble ${Chip8Emulator.toHex(nibbles[0], 0)}`);
            Chip8Emulator.halt();
        }
    } catch (error) {
        console.error(`Error executing instruction ${Chip8Emulator.toHex(instruction, 4)}:`, error);
        Chip8Emulator.halt();
    }
    
  }

}