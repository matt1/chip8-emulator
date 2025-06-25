
## Running in codespaces:

## Setup

First we need to amke sure `tsc` is installed.  In a github codespace there is already `npm` inbstalled so this is trivial

 - `npm install -g typescript`

Then for edit-refresh cycle we can do:
 - `tsc -w` in one terminal (watrching-compiler for the typescript files)
 - `python -m http.server` in another terminal (to server the files)

You'll get a forwarded port that you can access directly

## Refereces
 - https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/
 - https://github.com/mikeyhogarth/chip8-typescript