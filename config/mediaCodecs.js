
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
  }
];

module.exports = codecs;
