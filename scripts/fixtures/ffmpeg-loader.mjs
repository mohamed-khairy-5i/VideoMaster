// Loader hooks that redirect the CDN specifiers in src/utils/muxer.js onto the
// local stubs, so the real module can be exercised in Node with no network.
export async function resolve(specifier, context, next) {
  if (specifier.includes('@ffmpeg/ffmpeg')) {
    return { url: new URL('./ffmpeg-stub.mjs', import.meta.url).href, shortCircuit: true };
  }
  if (specifier.includes('@ffmpeg/util')) {
    return { url: new URL('./ffmpeg-util-stub.mjs', import.meta.url).href, shortCircuit: true };
  }
  return next(specifier, context);
}
