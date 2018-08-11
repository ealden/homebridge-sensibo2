var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-sensibo2', 'Sensibo', SensiboAccessory);
}

function SensiboAccessory(log, config) {
  this.log = log;
  this.name = config['name'];

  this.on = false;

  let fanService = new Service.Fan(this.name);
  fanService.getCharacteristic(Characteristic.On)
    .on('get', this.getFanStatus.bind(this))
    .on('set', this.setFanStatus.bind(this));

  this.fanService = fanService;
}

SensiboAccessory.prototype.getServices = function() {
  return [this.fanService];
}

SensiboAccessory.prototype.getFanStatus = function(next) {
  this.log('Get Fan Status: ' + this.on);

  return next(null, this.on);
}

SensiboAccessory.prototype.setFanStatus = function(on, next) {
  this.log('Set Fan Status: ' + on);

  this.on = on;

  return next();
}
