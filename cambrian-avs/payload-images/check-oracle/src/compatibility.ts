// compatibility.ts - Silent compatibility layer for Solana SDK
import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  transformEncoder
} from '@solana/codecs';

// Silently patch @solana/web3.js with the necessary codec functions
try {
  const web3js = require('@solana/web3.js');
  
  // Add all the codec functions to web3.js
  web3js.addDecoderSizePrefix = addDecoderSizePrefix;
  web3js.addEncoderSizePrefix = addEncoderSizePrefix;
  web3js.combineCodec = combineCodec;
  web3js.fixDecoderSize = fixDecoderSize;
  web3js.fixEncoderSize = fixEncoderSize;
  web3js.getBytesDecoder = getBytesDecoder;
  web3js.getBytesEncoder = getBytesEncoder;
  web3js.getStructDecoder = getStructDecoder;
  web3js.getStructEncoder = getStructEncoder;
  web3js.getU32Decoder = getU32Decoder;
  web3js.getU32Encoder = getU32Encoder;
  web3js.transformEncoder = transformEncoder;
} catch (e) {
  // Silent failure - don't log anything
}