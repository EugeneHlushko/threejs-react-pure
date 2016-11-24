// ref for watt: http://www.power-sure.com/lumens.htm
export const bulbLightPowers = {
  '1000W': 110000,
  '300W': 3500,
  '100W': 1700,
  '60W': 800,
  '40W': 400,
  '25W': 180,
  '20W': 20,
  'Off': 0,
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
export const hemisphereLightPowers = {
  'MoonlessNight': 0.0001,
  'NightAirglow': 0.002,
  'FullMoon': 0.5,
  'CityTwilight': 3.4,
  'LivingRoom': 50,
  'VeryOvercast': 100,
  'OfficeRoom': 350,
  'SunriseSunset': 400,
  'Overcast': 1000,
  'Daylight': 18000,
  'DirectSun': 50000,
};
