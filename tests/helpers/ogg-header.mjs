// Sample rate and channel count of an Ogg Vorbis or Ogg Opus file, read from the first page, so a test does not need ffprobe
// (the CI runner has none). Vorbis: identification header at the start of the first packet (RFC: 0x01 "vorbis", version,
// channels, rate). Opus always decodes at 48 kHz, whatever input rate the header remembers.
import fs from 'node:fs';

export function oggStream(file) {
 const b = fs.readFileSync(file);
 if (b.toString('latin1', 0, 4) !== 'OggS') throw new Error(file + ' is not an Ogg file');
 const segments = b[26], start = 27 + segments;
 if (b[start] === 1 && b.toString('latin1', start + 1, start + 7) === 'vorbis') {
  return {codec: 'vorbis', channels: b[start + 11], sampleRate: b.readUInt32LE(start + 12)};
 }
 if (b.toString('latin1', start, start + 8) === 'OpusHead') {
  return {codec: 'opus', channels: b[start + 9], sampleRate: 48000};
 }
 throw new Error(file + ': neither Vorbis nor Opus');
}
