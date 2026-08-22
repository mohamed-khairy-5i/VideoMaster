// A stand-in for @ffmpeg/ffmpeg that copies the parts of the real API the muxer
// depends on, so src/utils/muxer.js can be tested without downloading 30MB of
// wasm from a CDN on every run.
//
// The listener semantics below are copied from the real
// @ffmpeg/ffmpeg@0.12.10 dist/esm/classes.js: `on` pushes into an array with no
// dedup check, and `off` removes by identity. That is exactly the behaviour the
// test needs to observe, so it must not be "improved" here.

export const stubState = {
  instances: 0,
  execCalls: 0,
  /** Set to n to make the next n exec() calls throw. */
  failNextExecs: 0,
  /** Progress ticks emitted per exec() call. */
  ticksPerExec: 10,
};

export function resetStubState() {
  stubState.instances = 0;
  stubState.execCalls = 0;
  stubState.failNextExecs = 0;
  stubState.ticksPerExec = 10;
}

export class FFmpeg {
  #progressCallbacks = [];

  #logCallbacks = [];

  constructor() {
    stubState.instances += 1;
    /** Stands in for ffmpeg's in-memory virtual filesystem. */
    this.files = new Map();
    FFmpeg.last = this;
  }

  async load() {
    return true;
  }

  on(event, callback) {
    if (event === 'progress') this.#progressCallbacks.push(callback);
    else this.#logCallbacks.push(callback);
  }

  off(event, callback) {
    if (event === 'progress') {
      this.#progressCallbacks = this.#progressCallbacks.filter((f) => f !== callback);
    } else {
      this.#logCallbacks = this.#logCallbacks.filter((f) => f !== callback);
    }
  }

  /** Test-only view of how many progress listeners are still attached. */
  get progressListenerCount() {
    return this.#progressCallbacks.length;
  }

  /** Test-only view of which paths are still occupying the virtual filesystem. */
  get openFiles() {
    return [...this.files.keys()].sort();
  }

  async writeFile(name, data) {
    this.files.set(name, data);
  }

  async readFile(name) {
    if (!this.files.has(name)) throw new Error(`readFile: no such file: ${name}`);
    return this.files.get(name);
  }

  async deleteFile(name) {
    // The real implementation throws when the path does not exist, which is why
    // the muxer wraps each delete in its own try.
    if (!this.files.has(name)) throw new Error(`deleteFile: no such file: ${name}`);
    this.files.delete(name);
  }

  async exec() {
    stubState.execCalls += 1;

    for (let i = 1; i <= stubState.ticksPerExec; i += 1) {
      const progress = i / stubState.ticksPerExec;
      for (const cb of this.#progressCallbacks) cb({ progress });
    }

    if (stubState.failNextExecs > 0) {
      stubState.failNextExecs -= 1;
      throw new Error('ffmpeg exec failed');
    }

    // A minimal MP4 header so the caller sees plausible bytes.
    this.files.set('out.mp4', new Uint8Array([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70]));
  }
}
