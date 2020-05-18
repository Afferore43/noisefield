import 'https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js';

function sumOcatave(simplex, num_iterations, x, y, z, persistence, scl, low, high) {
  var maxAmp = 0, amp = 1, freq = scl, noise = 0;
  for(var i = 0; i < num_iterations; ++i) {
    noise += simplex.noise3D(x * freq, y * freq, z * freq) * amp;
    maxAmp += amp;
    amp *= persistence;
    freq *= 2;
  }
  return (noise / maxAmp) * (high - low) / 2 + (high + low) / 2;
}

export class NoiseField {
  constructor(opt) {
    if(!opt) opt = {};
    
    this.noiseScale =  opt.noiseScale || 1;
    this.octaves = opt.octaves || 1;
    this.persistence =  opt.persistence || 1;
    this.power =  opt.power || 1;
    
    this.minHeight = opt.minHeight || 0;
    this.maxHeight = opt.maxHeight || 1;
    
    this.shouldNormalise = opt.shouldNormalise != undefined ? opt.shouldNormalise : false;
    this.noiseShift = opt.noiseShift || [0, 0, 0];
  
    this.simplex = new SimplexNoise();
  }
  
  setNoiseShift(x, y, z) {
    this.noiseShift = [x, y, z];
  }
  addNoiseShift(dX, dY, dZ) {
    this.noiseShift[0] += dX;
    this.noiseShift[1] += dY;
    this.noiseShift[2] += dZ;
  }
  
  getNormalizedValue(x, y, z) {
    let l = this.shouldNormalise ? Math.sqrt(x * x + y * y + z * z) : 1;
    x = x / l;
    y = y / l;
    z = z / l;
    
    let h = sumOcatave(this.simplex, this.octaves, x + this.noiseShift[0], y + this.noiseShift[1], z + this.noiseShift[2], this.persistence, this.noiseScale, 0, 1);
    return Math.pow(h, this.power);
  }
  getValue(x, y, z) {
    return this.getNormalizedValue(x, y, z) * (this.maxHeight - this.minHeight) + this.minHeight;
  }
}