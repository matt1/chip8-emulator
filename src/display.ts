import { Tickable } from "./common.js";

export class Chip8Display implements Tickable {
  readonly width = 64;
  readonly height = 32;
  scale = 4;
  /** Contains the pixel state for the display. */
  pixels!: boolean[][];



  constructor(private readonly ctx: CanvasRenderingContext2D, scale?:number) {
    if (scale) this.scale = scale;
    console.log(`Initialising display - scale ${this.scale} - ${this.width * this.scale}x${this.height * this.scale}`);
    this.init();
  }

  init() {
    this.ctx.canvas.width = this.width * this.scale;
    this.ctx.canvas.height = this.height * this.scale;

    this.pixels = Array.from({ length: this.width }, () => Array.from({ length: this.height }, () => false));
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixels[x][y] = false;
      }
    }
  }

  tick() {
    this.render();
  }

  render() {
    this.clear();
    this.ctx.fillStyle = 'white';
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.pixels[x][y] === true) {
          this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }
      }
    }
  }

  clear() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
  }
}