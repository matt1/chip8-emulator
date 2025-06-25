export class Chip8Memory {
  private readonly ramSize = 4096;
  private ram!:Uint8Array;

  private readonly stackSize = 16;
  private stack!:Array<number>;

  // Start of ROM location - by convetion this is always 0x200
  private readonly memoryStart = 0x200;

  private dataView!:DataView;

  constructor() {
    console.log(`Initialising memory - ${this.ramSize} bytes`)
    this.init();
  }

  init() {
    this.reset();
  }

  public reset() {
    this.ram = new Uint8Array(this.ramSize);
    this.stack = new Array<number>();
    this.dataView = new DataView(this.ram.buffer);
  }

  public pushStack(num:number) {
    this.stack.push(num);
  }

  public popStack(): number | undefined {
    return this.stack.pop();
  }

  public readByte(offset:number) {
    return this.dataView.getUint8(offset);
  }

  public readWord(offset:number) {
    return this.dataView.getUint16(offset);
  }

  public loadRom(buffer:Uint8Array) {
    for (let i = 0; i<buffer.length;i++) {
      this.ram[i + this.memoryStart] = buffer[i];
    }
    console.log(`Loaded ROM (${buffer.length} bytes) into memory...`);
  }
}

