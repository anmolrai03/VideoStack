// CRF = CONSTANT RATE FACTOR , tells encoder hwo much quality to keep , and let ffmpeg decide how many bits are needed to achieve that.

const VIDEO_PRESETS = {
  240: {scale: -2 * 240 , crf: 24},
}