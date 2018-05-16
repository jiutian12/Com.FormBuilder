window.Utils = window.Utils || {};
window.Utils = (function (utils, win, $) {
    utils.Express = function () {
        this.condtions = [];
    }
    utils.Express.prototype = {
        push: function (field, value, oper, logic, isExpress) {
            oper = oper || "=";
            logic = logic || "and";
            isExpress = isExpress || false;
            this.condtions.push({
                LeftBrace: "",
                ParamName: field,
                Operate: oper,
                IsExpress: isExpress,
                ExpressValue: value,
                RightBrace: "",
                Logic: logic
            });
        },
        add: function (LeftBrace, RightBrace, field, value, oper, logic) {
            oper = oper || "=";
            logic = logic || "and";
            this.condtions.push({
                LeftBrace: LeftBrace,
                ParamName: field,
                Operate: oper,
                IsExpress: false,
                ExpressValue: value,
                RightBrace: RightBrace,
                Logic: logic
            });
        },
        joinCondition: function (filterlist) {

            this.condtions = this.condtions.concat(filterlist);
        },
        serialize: function () {
            return this.condtions;
        },
        getSql: function () {
            var arr = [];
            $.each(this.condtions, function (i, row) {
                var value = row.ExpressValue;
                if (!row.IsExpress) {
                    if (row.Operate == "like") {
                        value = "'%" + value + "'";
                    } else if (row.Operate == "leftlike") {
                        value = "'%" + value + "%'";
                    } else if (row.Operate == "rightlike") {
                        value = "'%" + value + "'";
                    } else {
                        value = "'" + value + "'";
                    }
                }
                arr.push(row.LeftBrace + row.Logic + " " + row.ParamName + " " + row.Operate + " " + value + " " + row.RightBrace);
            });
            return arr.join(" ");

        }
    };



    utils.SortCondition = function () {
        this.sorts = [];
    }
    utils.SortCondition.prototype = {
        push: function (field, order) {
            order = order || "asc";
            this.sorts.push({
                Field: field,
                Order: order
            });
        },
        serialize: function () {
            return this.sorts;
        }
    };
    return utils;
})(window.Utils, window, $);



/*cryptojs-3.1.9*/
(function (q, f) { "object" === typeof exports ? module.exports = exports = f() : "function" === typeof define && define.amd ? define([], f) : q.CryptoJS = f() })(this, function () {
    var q = q || function (f, g) {
        var d = Object.create || function () { function a() { } return function (e) { a.prototype = e; e = new a; a.prototype = null; return e } }(), k = {}, h = k.lib = {}, l = h.Base = function () {
            return {
                extend: function (a) {
                    var e = d(this); a && e.mixIn(a); e.hasOwnProperty("init") && this.init !== e.init || (e.init = function () { e.$super.init.apply(this, arguments) }); e.init.prototype =
                    e; e.$super = this; return e
                }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var e in a) a.hasOwnProperty(e) && (this[e] = a[e]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) }
            }
        }(), n = h.WordArray = l.extend({
            init: function (a, e) { a = this.words = a || []; this.sigBytes = e != g ? e : 4 * a.length }, toString: function (a) { return (a || t).stringify(this) }, concat: function (a) {
                var e = this.words, c = a.words, b =
                this.sigBytes; a = a.sigBytes; this.clamp(); if (b % 4) for (var m = 0; m < a; m++) e[b + m >>> 2] |= (c[m >>> 2] >>> 24 - m % 4 * 8 & 255) << 24 - (b + m) % 4 * 8; else for (m = 0; m < a; m += 4) e[b + m >>> 2] = c[m >>> 2]; this.sigBytes += a; return this
            }, clamp: function () { var a = this.words, e = this.sigBytes; a[e >>> 2] &= 4294967295 << 32 - e % 4 * 8; a.length = f.ceil(e / 4) }, clone: function () { var a = l.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) {
                for (var e = [], c = function (c) {
                var b = 987654321; return function () {
                b = 36969 * (b & 65535) + (b >> 16) & 4294967295; c = 18E3 * (c &
                65535) + (c >> 16) & 4294967295; var m = (b << 16) + c & 4294967295, m = m / 4294967296 + .5; return m * (.5 < f.random() ? 1 : -1)
                }
                }, b = 0, m; b < a; b += 4) { var y = c(4294967296 * (m || f.random())); m = 987654071 * y(); e.push(4294967296 * y() | 0) } return new n.init(e, a)
            }
        }), w = k.enc = {}, t = w.Hex = {
            stringify: function (a) { var e = a.words; a = a.sigBytes; for (var c = [], b = 0; b < a; b++) { var m = e[b >>> 2] >>> 24 - b % 4 * 8 & 255; c.push((m >>> 4).toString(16)); c.push((m & 15).toString(16)) } return c.join("") }, parse: function (a) {
                for (var e = a.length, c = [], b = 0; b < e; b += 2) c[b >>> 3] |= parseInt(a.substr(b,
                2), 16) << 24 - b % 8 * 4; return new n.init(c, e / 2)
            }
        }, p = w.Latin1 = { stringify: function (a) { var e = a.words; a = a.sigBytes; for (var c = [], b = 0; b < a; b++) c.push(String.fromCharCode(e[b >>> 2] >>> 24 - b % 4 * 8 & 255)); return c.join("") }, parse: function (a) { for (var e = a.length, c = [], b = 0; b < e; b++) c[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - b % 4 * 8; return new n.init(c, e) } }, q = w.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(p.stringify(a))) } catch (e) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return p.parse(unescape(encodeURIComponent(a))) } },
        v = h.BufferedBlockAlgorithm = l.extend({
            reset: function () { this._data = new n.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = q.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var e = this._data, c = e.words, b = e.sigBytes, m = this.blockSize, y = b / (4 * m), y = a ? f.ceil(y) : f.max((y | 0) - this._minBufferSize, 0); a = y * m; b = f.min(4 * a, b); if (a) { for (var x = 0; x < a; x += m) this._doProcessBlock(c, x); x = c.splice(0, a); e.sigBytes -= b } return new n.init(x, b) }, clone: function () {
                var a = l.clone.call(this);
                a._data = this._data.clone(); return a
            }, _minBufferSize: 0
        }); h.Hasher = v.extend({
            cfg: l.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { v.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (e, c) { return (new a.init(c)).finalize(e) } }, _createHmacHelper: function (a) {
                return function (e, c) {
                    return (new r.HMAC.init(a,
                    c)).finalize(e)
                }
            }
        }); var r = k.algo = {}; return k
    }(Math); (function () {
        var f = q, g = f.lib.WordArray; f.enc.Base64 = {
            stringify: function (d) { var k = d.words, h = d.sigBytes, l = this._map; d.clamp(); d = []; for (var n = 0; n < h; n += 3) for (var f = (k[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 16 | (k[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255) << 8 | k[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255, g = 0; 4 > g && n + .75 * g < h; g++) d.push(l.charAt(f >>> 6 * (3 - g) & 63)); if (k = l.charAt(64)) for (; d.length % 4;) d.push(k); return d.join("") }, parse: function (d) {
                var k = d.length, h = this._map, l = this._reverseMap; if (!l) for (var l =
                this._reverseMap = [], n = 0; n < h.length; n++) l[h.charCodeAt(n)] = n; if (h = h.charAt(64)) h = d.indexOf(h), -1 !== h && (k = h); for (var h = [], f = n = 0; f < k; f++) if (f % 4) { var t = l[d.charCodeAt(f - 1)] << f % 4 * 2, p = l[d.charCodeAt(f)] >>> 6 - f % 4 * 2; h[n >>> 2] |= (t | p) << 24 - n % 4 * 8; n++ } return g.create(h, n)
            }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        }
    })(); (function () {
        if ("function" == typeof ArrayBuffer) {
            var f = q.lib.WordArray, g = f.init; (f.init = function (d) {
                d instanceof ArrayBuffer && (d = new Uint8Array(d)); if (d instanceof Int8Array ||
                "undefined" !== typeof Uint8ClampedArray && d instanceof Uint8ClampedArray || d instanceof Int16Array || d instanceof Uint16Array || d instanceof Int32Array || d instanceof Uint32Array || d instanceof Float32Array || d instanceof Float64Array) d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength); if (d instanceof Uint8Array) { for (var k = d.byteLength, f = [], l = 0; l < k; l++) f[l >>> 2] |= d[l] << 24 - l % 4 * 8; g.call(this, f, k) } else g.apply(this, arguments)
            }).prototype = f
        }
    })(); (function () {
        var f = q, g = f.lib, d = g.Base, k = g.WordArray, g = f.algo, h = g.EvpKDF =
        d.extend({ cfg: d.extend({ keySize: 4, hasher: g.MD5, iterations: 1 }), init: function (d) { this.cfg = this.cfg.extend(d) }, compute: function (d, f) { for (var h = this.cfg, g = h.hasher.create(), p = k.create(), q = p.words, v = h.keySize, h = h.iterations; q.length < v;) { r && g.update(r); var r = g.update(d).finalize(f); g.reset(); for (var a = 1; a < h; a++) r = g.finalize(r), g.reset(); p.concat(r) } p.sigBytes = 4 * v; return p } }); f.EvpKDF = function (d, f, k) { return h.create(k).compute(d, f) }
    })(); q.lib.Cipher || function (f) {
        var g = q, d = g.lib, k = d.Base, h = d.WordArray, l =
        d.BufferedBlockAlgorithm, n = g.enc.Base64, w = g.algo.EvpKDF, t = d.Cipher = l.extend({
            cfg: k.extend(), createEncryptor: function (c, b) { return this.create(this._ENC_XFORM_MODE, c, b) }, createDecryptor: function (c, b) { return this.create(this._DEC_XFORM_MODE, c, b) }, init: function (c, b, m) { this.cfg = this.cfg.extend(m); this._xformMode = c; this._key = b; this.reset() }, reset: function () { l.reset.call(this); this._doReset() }, process: function (c) { this._append(c); return this._process() }, finalize: function (c) { c && this._append(c); return this._doFinalize() },
            keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () { return function (c) { return { encrypt: function (b, m, y) { return ("string" == typeof m ? e : a).encrypt(c, b, m, y) }, decrypt: function (b, m, y) { return ("string" == typeof m ? e : a).decrypt(c, b, m, y) } } } }()
        }); d.StreamCipher = t.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var p = g.mode = {}, z = d.BlockCipherMode = k.extend({
            createEncryptor: function (c, b) { return this.Encryptor.create(c, b) }, createDecryptor: function (c, b) {
                return this.Decryptor.create(c,
                b)
            }, init: function (c, b) { this._cipher = c; this._iv = b }
        }), p = p.CBC = function () { function c(c, b, a) { var e = this._iv; e ? this._iv = f : e = this._prevBlock; for (var d = 0; d < a; d++) c[b + d] ^= e[d] } var b = z.extend(); b.Encryptor = b.extend({ processBlock: function (b, a) { var e = this._cipher, d = e.blockSize; c.call(this, b, a, d); e.encryptBlock(b, a); this._prevBlock = b.slice(a, a + d) } }); b.Decryptor = b.extend({ processBlock: function (b, a) { var e = this._cipher, d = e.blockSize, f = b.slice(a, a + d); e.decryptBlock(b, a); c.call(this, b, a, d); this._prevBlock = f } }); return b }(),
        v = (g.pad = {}).Pkcs7 = { pad: function (c, b) { for (var a = 4 * b, a = a - c.sigBytes % a, e = a << 24 | a << 16 | a << 8 | a, d = [], f = 0; f < a; f += 4) d.push(e); a = h.create(d, a); c.concat(a) }, unpad: function (c) { c.sigBytes -= c.words[c.sigBytes - 1 >>> 2] & 255 } }; d.BlockCipher = t.extend({
            cfg: t.cfg.extend({ mode: p, padding: v }), reset: function () {
                t.reset.call(this); var c = this.cfg, b = c.iv, c = c.mode; if (this._xformMode == this._ENC_XFORM_MODE) var a = c.createEncryptor; else a = c.createDecryptor, this._minBufferSize = 1; this._mode && this._mode.__creator == a ? this._mode.init(this,
                b && b.words) : (this._mode = a.call(c, this, b && b.words), this._mode.__creator = a)
            }, _doProcessBlock: function (c, b) { this._mode.processBlock(c, b) }, _doFinalize: function () { var c = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { c.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), c.unpad(b); return b }, blockSize: 4
        }); var r = d.CipherParams = k.extend({ init: function (c) { this.mixIn(c) }, toString: function (c) { return (c || this.formatter).stringify(this) } }), p = (g.format = {}).OpenSSL = {
            stringify: function (c) {
                var b =
                c.ciphertext; c = c.salt; return (c ? h.create([1398893684, 1701076831]).concat(c).concat(b) : b).toString(n)
            }, parse: function (c) { c = n.parse(c); var b = c.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var a = h.create(b.slice(2, 4)); b.splice(0, 4); c.sigBytes -= 16 } return r.create({ ciphertext: c, salt: a }) }
        }, a = d.SerializableCipher = k.extend({
            cfg: k.extend({ format: p }), encrypt: function (c, b, a, e) {
                e = this.cfg.extend(e); var d = c.createEncryptor(a, e); b = d.finalize(b); d = d.cfg; return r.create({
                    ciphertext: b, key: a, iv: d.iv, algorithm: c, mode: d.mode,
                    padding: d.padding, blockSize: c.blockSize, formatter: e.format
                })
            }, decrypt: function (c, b, a, e) { e = this.cfg.extend(e); b = this._parse(b, e.format); return c.createDecryptor(a, e).finalize(b.ciphertext) }, _parse: function (c, b) { return "string" == typeof c ? b.parse(c, this) : c }
        }), g = (g.kdf = {}).OpenSSL = { execute: function (c, b, a, e) { e || (e = h.random(8)); c = w.create({ keySize: b + a }).compute(c, e); a = h.create(c.words.slice(b), 4 * a); c.sigBytes = 4 * b; return r.create({ key: c, iv: a, salt: e }) } }, e = d.PasswordBasedCipher = a.extend({
            cfg: a.cfg.extend({ kdf: g }),
            encrypt: function (c, b, e, d) { d = this.cfg.extend(d); e = d.kdf.execute(e, c.keySize, c.ivSize); d.iv = e.iv; c = a.encrypt.call(this, c, b, e.key, d); c.mixIn(e); return c }, decrypt: function (c, b, e, d) { d = this.cfg.extend(d); b = this._parse(b, d.format); e = d.kdf.execute(e, c.keySize, c.ivSize, b.salt); d.iv = e.iv; return a.decrypt.call(this, c, b, e.key, d) }
        })
    }(); (function () {
        var f = q, g = f.lib.BlockCipher, d = f.algo, k = [], h = [], l = [], n = [], w = [], t = [], p = [], z = [], v = [], r = []; (function () {
            for (var a = [], c = 0; 256 > c; c++) a[c] = 128 > c ? c << 1 : c << 1 ^ 283; for (var b = 0, d =
            0, c = 0; 256 > c; c++) { var f = d ^ d << 1 ^ d << 2 ^ d << 3 ^ d << 4, f = f >>> 8 ^ f & 255 ^ 99; k[b] = f; h[f] = b; var x = a[b], g = a[x], B = a[g], u = 257 * a[f] ^ 16843008 * f; l[b] = u << 24 | u >>> 8; n[b] = u << 16 | u >>> 16; w[b] = u << 8 | u >>> 24; t[b] = u; u = 16843009 * B ^ 65537 * g ^ 257 * x ^ 16843008 * b; p[f] = u << 24 | u >>> 8; z[f] = u << 16 | u >>> 16; v[f] = u << 8 | u >>> 24; r[f] = u; b ? (b = x ^ a[a[a[B ^ x]]], d ^= a[a[d]]) : b = d = 1 }
        })(); var a = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], d = d.AES = g.extend({
            _doReset: function () {
                if (!this._nRounds || this._keyPriorReset !== this._key) {
                    for (var e = this._keyPriorReset = this._key, c = e.words, b =
                    e.sigBytes / 4, e = 4 * ((this._nRounds = b + 6) + 1), d = this._keySchedule = [], f = 0; f < e; f++) if (f < b) d[f] = c[f]; else { var g = d[f - 1]; f % b ? 6 < b && 4 == f % b && (g = k[g >>> 24] << 24 | k[g >>> 16 & 255] << 16 | k[g >>> 8 & 255] << 8 | k[g & 255]) : (g = g << 8 | g >>> 24, g = k[g >>> 24] << 24 | k[g >>> 16 & 255] << 16 | k[g >>> 8 & 255] << 8 | k[g & 255], g ^= a[f / b | 0] << 24); d[f] = d[f - b] ^ g } c = this._invKeySchedule = []; for (b = 0; b < e; b++) f = e - b, g = b % 4 ? d[f] : d[f - 4], c[b] = 4 > b || 4 >= f ? g : p[k[g >>> 24]] ^ z[k[g >>> 16 & 255]] ^ v[k[g >>> 8 & 255]] ^ r[k[g & 255]]
                }
            }, encryptBlock: function (a, c) {
                this._doCryptBlock(a, c, this._keySchedule,
                l, n, w, t, k)
            }, decryptBlock: function (a, c) { var b = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = b; this._doCryptBlock(a, c, this._invKeySchedule, p, z, v, r, h); b = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = b }, _doCryptBlock: function (a, c, b, d, f, g, k, h) {
                for (var n = this._nRounds, l = a[c] ^ b[0], p = a[c + 1] ^ b[1], r = a[c + 2] ^ b[2], q = a[c + 3] ^ b[3], t = 4, v = 1; v < n; v++) var w = d[l >>> 24] ^ f[p >>> 16 & 255] ^ g[r >>> 8 & 255] ^ k[q & 255] ^ b[t++], z = d[p >>> 24] ^ f[r >>> 16 & 255] ^ g[q >>> 8 & 255] ^ k[l & 255] ^ b[t++], A = d[r >>> 24] ^ f[q >>> 16 & 255] ^ g[l >>> 8 & 255] ^ k[p & 255] ^ b[t++], q = d[q >>> 24] ^ f[l >>> 16 & 255] ^ g[p >>> 8 & 255] ^
                k[r & 255] ^ b[t++], l = w, p = z, r = A; w = (h[l >>> 24] << 24 | h[p >>> 16 & 255] << 16 | h[r >>> 8 & 255] << 8 | h[q & 255]) ^ b[t++]; z = (h[p >>> 24] << 24 | h[r >>> 16 & 255] << 16 | h[q >>> 8 & 255] << 8 | h[l & 255]) ^ b[t++]; A = (h[r >>> 24] << 24 | h[q >>> 16 & 255] << 16 | h[l >>> 8 & 255] << 8 | h[p & 255]) ^ b[t++]; q = (h[q >>> 24] << 24 | h[l >>> 16 & 255] << 16 | h[p >>> 8 & 255] << 8 | h[r & 255]) ^ b[t++]; a[c] = w; a[c + 1] = z; a[c + 2] = A; a[c + 3] = q
            }, keySize: 8
        }); f.AES = g._createHelper(d)
    })(); return q
});

/*加密解密*/
window.lb = window.lb || {};
window.lb.crypto || (function (plat) {
    var obj = {};

    obj.randomKey = function () {
        var ret = '', rlen = 16, str = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', mIndex = str.length - 1;
        for (var i = 0; i < rlen; i++) {
            ret += str[Math.floor(Math.random() * mIndex)];
        }
        return ret;
    }

    obj.strEncrypt = function (str, key) {
        var crypto = CryptoJS, mod = crypto.mode.CBC, pad = crypto.pad.Pkcs7, kSize = 128 / 8, p = crypto.enc.Utf8.parse;
        var k = p(key + key), iv = p(key);
        return crypto.AES.encrypt(str, k, { keySize: kSize, iv: iv, mode: mod, padding: pad }).toString();
    }

    plat.crypto = obj;
})(window.lb);
