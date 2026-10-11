// Lightweight iconv-lite shim for Cloudflare Workers / edge environments
// Replaces node_modules/iconv-lite to eliminate stream bundling bugs (require_streams)

export function encodingExists(enc) {
  if (!enc) return false;
  const normalized = String(enc).toLowerCase().replace(/[^a-z0-9]/g, "");
  if (/^(utf8|utf16le|ascii|latin1|binary|ucs2|hex|base64)$/.test(normalized)) {
    return true;
  }
  try {
    new TextDecoder(enc);
    return true;
  } catch {
    return false;
  }
}

export function toEncoding(str) {
  return str;
}

export function fromEncoding(buf, encoding) {
  try {
    return new TextDecoder(encoding || "utf-8").decode(buf);
  } catch {
    return new TextDecoder("utf-8").decode(buf);
  }
}

export function decode(buf, encoding) {
  if (typeof buf === "string") return buf;
  try {
    return new TextDecoder(encoding || "utf-8").decode(buf);
  } catch {
    return new TextDecoder("utf-8").decode(buf);
  }
}

export function encode(str, encoding) {
  return new TextEncoder().encode(str);
}

export function getDecoder(encoding) {
  let decoder;
  try {
    decoder = new TextDecoder(encoding || "utf-8");
  } catch {
    decoder = new TextDecoder("utf-8");
  }
  return {
    write(chunk) {
      return decoder.decode(chunk, { stream: true });
    },
    end() {
      return decoder.decode();
    },
  };
}

export function getEncoder() {
  const encoder = new TextEncoder();
  return {
    write(str) {
      return encoder.encode(str);
    },
    end() {},
  };
}

const iconvShim = {
  encodingExists,
  toEncoding,
  fromEncoding,
  decode,
  encode,
  getDecoder,
  getEncoder,
};

export default iconvShim;
