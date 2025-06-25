export class Chip8Registers {
  // Program counter
  _pc = 0;
  set pc(value: number|undefined) {
    if (value === undefined || value < 0 || value > 0xFFF) {
      throw new Error(`Invalid program counter value: ${value}. It must be between 0 and 0xFFF.`);
    } else {
      this._pc = value;
    }
  }

  get pc(): number {
    return this._pc;
  }

  i = 0;

  // Delay timer
  dt = 0;

  // Sound timer
  st = 0;

  v = new Array<number>(16);

  constructor() {
    console.log('Initialising registers');
    this.init();
  }

  init() {
    this.reset();
  }

  public reset() {
    this.pc = 0x200;
    this.i = 0;
    this.dt = 0;
    this.st = 0;
    this.v = new Array<number>(16);
  }
}

