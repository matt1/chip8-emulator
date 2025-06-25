import { Tickable } from "./common.js";
import { Chip8Cpu } from "./cpu.js";
import { Chip8Display } from "./display.js";
import { Chip8Memory } from "./memory.js";
import { Chip8Registers } from "./registers.js";

export class Chip8Emulator {
  /** Main system components */
  private readonly cpu: Chip8Cpu;
  private readonly registers: Chip8Registers;
  private readonly ram: Chip8Memory;
  private readonly gpu: Chip8Display

  /** Targetted FPS for the CPU. */
  private readonly tickFpsTarget = 60;
  private tickInterval!: number;

  /** Timestamp from the previous tick */
  private lastTick!: DOMHighResTimeStamp;

  /** Contains all system components that can be "ticked" by the main clock. */
  private tickables: Tickable[] = [];

  private static halted = false;

  public static async create(ctx: CanvasRenderingContext2D) {
    const instance = new Chip8Emulator(ctx);
    
    const romBytes = await await instance.loadRomUrl('./IBM%20Logo.ch8');
    instance.ram.loadRom(romBytes);

    return instance;
  }

  public static halt() {
    this.halted = true;
  }

  public static toHex(num:number, length = 2) {
    return num.toString(16).padStart(length, '0');
  }

  private constructor(ctx: CanvasRenderingContext2D) {
    console.log('Chip8 emulator loaded.  Starting CPU...');
    this.gpu = new Chip8Display(ctx, 8);
    this.ram = new Chip8Memory();
    this.registers = new Chip8Registers();
    this.cpu = new Chip8Cpu(this.registers, this.ram, this.gpu);

    this.tickables = [this.cpu, this.gpu];

    this.init();
  }

  /** Initialise the CPU, including setting up timers etc. */
  protected init() {
    this.tickInterval = 1000 / this.tickFpsTarget;
    //this.frameStart = window.performance.now();

    requestAnimationFrame((t) => this.tick(t));
  }

  protected tick(tickTime) {
    if (Chip8Emulator.halted) {
      console.log('Emulator halted');
      return;
    }
    requestAnimationFrame((t) => this.tick(t));
    const elapsed = tickTime - this.lastTick;
    if ((tickTime - this.lastTick) > this.tickInterval) {
      for (const tickable of this.tickables) {
        tickable.tick();
      }
    }
    this.lastTick = tickTime;
  }

  protected async loadRomUrl(url:string):Promise<Uint8Array> {
    const rom = await fetch(url)
      .then((r) => r.arrayBuffer())
      .then((data) => new Uint8Array(data));
    return rom;
  }
}
