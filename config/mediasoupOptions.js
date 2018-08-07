
var priv = require('quick-local-ip');
var ipPriv = priv.getLocalIP4().toString();
const options = {
  numWorkers      : 1,
  logLevel        : 'warn',
  logTags         : ['info', 'ice', 'dlts', 'rtp', 'srtp', 'rtcp', 'rbe', 'rtx'],

  rtcIPv6         : false,
  /*rtcMinPort      : 20000,
  rtcMaxPort      : 20100,*/
 
}


module.exports = options;
