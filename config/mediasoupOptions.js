
var priv = require('quick-local-ip');
var ipPriv = priv.getLocalIP4().toString();
const options = {
  numWorkers      : 1,
  logLevel        : 'warn',
  logTags         : ['info', 'ice', 'dlts', 'rtp', 'srtp', 'rtcp', 'rbe', 'rtx'],
  rtcIPv6         : false
  /*rtcMinPort      : 40000,
  rtcMaxPort      : 40010*/

}


module.exports = options;
