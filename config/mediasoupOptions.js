
var priv = require('quick-local-ip');
var ipPriv = priv.getLocalIP4().toString();
const options = {
  numWorkers      : 1,
  logLevel        : 'warn',
  logTags         : ['info', 'ice', 'dlts', 'rtp', 'srtp', 'rtcp', 'rbe', 'rtx'],
  rtcIPv4         : ipPriv,
  rtcAnnouncedIPv4: "35.242.182.167",
  rtcIPv6         : false,
}


module.exports = options;
