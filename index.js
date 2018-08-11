var request = require('request');
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-sensibo2', 'Sensibo', SensiboAccessory);
}

function SensiboAccessory(log, config) {
  this.log = log;
  this.name = config['name'];
  this.apiKey = config['apiKey'];
  this.device = config['device'];

  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Sensibo Inc.')
    .setCharacteristic(Characteristic.Model, 'Sensibo SKY')
    .setCharacteristic(Characteristic.SerialNumber, 'SEN-SKY-01');

  this.informationService = informationService;

  var fanService = new Service.Fan(this.name);
  fanService.getCharacteristic(Characteristic.On)
    .on('get', this.getFanStatus.bind(this))
    .on('set', this.setFanStatus.bind(this));

  this.fanService = fanService;
}

SensiboAccessory.prototype.getServices = function() {
  return [this.informationService, this.fanService];
}

var API = 'https://home.sensibo.com/api/v2';

SensiboAccessory.prototype.getFanStatus = function(next) {
  this.log('Get Fan Status');

  var options = {
    url: API + '/pods/' + this.device + '/acStates',
    qs: {
      'apiKey': this.apiKey,
      'fields': 'acState',
      'limit': 1,
    }
  }

  request.get(options, function(error, response, body) {
        var data = JSON.parse(body);
        var on = data.result[0].acState.on;

        return next(null, on);
      });
}

SensiboAccessory.prototype.setFanStatus = function(on, next) {
  this.log('Set Fan Status to: ' + ((on) ? 'on' : 'off'));

  var options = {
    url: API + '/pods/' + this.device + '/acStates',
    qs: { 'apiKey': this.apiKey },
    body: { 'acState': { 'on': !!on } },
    json: true
  }

  request.post(options, function(error, response, body) {
      request.post(options, function(error, response, body) {
            return next();
          })
      });
}
