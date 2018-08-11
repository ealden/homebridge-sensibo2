var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-sensibo2', 'Sensibo', SensiboAccessory);
}

function SensiboAccessory(log, config) {
}

SensiboAccessory.prototype.getServices = function() {
  return [];
}
