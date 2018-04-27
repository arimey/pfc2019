
const codecs =
[
  {
    kind        : "audio",
    name        : "opus",
    clockRate   : 48000,
    channels    : 2,
    parameters  :
    {
      useinbandfec : 1
    }
  },
  {
    kind      : "video",
    name      : "VP8",
    clockRate : 90000
  },
  {
    kind       : "video",
    name       : "H264",
    clockRate  : 90000,
    parameters :
    {
      "packetization-mode"      : 1,
      "profile-level-id"        : "42e01f",
      "level-asymmetry-allowed" : 1
    }
  }
];

module.exports = codecs;
