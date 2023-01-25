/**
 * This is a JavaScript translation of Java's DataInputStream
 * Java source from https://developer.classpath.org/doc/java/io/DataInputStream-source.html
 * Java's source, and hence this source, is licensed under GPL2
 * The classpath exception still applies
 * Refer to DataIOLicense.txt for a copy of GPL2
 */
class DataInputStream {
    constructor(bytes) {
        this.bytes = bytes;
    }
    read() {
        return this.bytes.shift();
    }
    readBuffer(buf, offset, len) {
        for (var i = 0; i < len; i++)
            buf[offset + i] = this.read();
    }
    readBoolean() {
        var byte = this.read();
        if (byte === 1) return true;
        else if (byte === 0) return false;
        else throw new Error("Invalid boolean format! Expected a 1 or 0! (Received " + byte + ")");
    }
    readByte() {
        return this.read();
    }
    readShort() {
        return (this.read() << 8) | (this.read());
    }
    readChar() {
        return String.fromCharCode(this.readShort());
    }
    readInt() {
        return (this.read() << 24) | (this.read() << 16) | (this.read() << 8) | (this.read());
    }
    readLong() {
        var view = new DataView(new ArrayBuffer(8));
        for (var i = 0; i < 8; i++)
            view.setUint8(i, this.read());
        return view.getBigInt64(0);
    }
    readFloat() {
        var view = new DataView(new ArrayBuffer(4));
        for (var i = 0; i < 4; i++)
            view.setUint8(i, this.read());
        return view.getFloat32(0);
    }
    readDouble() {
        var view = new DataView(new ArrayBuffer(8));
        for (var i = 0; i < 8; i++)
            view.setUint8(i, this.read());
        return view.getFloat64(0);
    }
    readUTF() {
        var UTFlen = this.readShort();
        var buf = [];
        this.readBuffer(buf, 0, UTFlen);
        return this.convertFromUTF(buf);
    }
    convertFromUTF(buf) {
        var strbuf = "";
        
        for (var i = 0; i < buf.length; ) {
            if ((buf [i] & 0x80) === 0)        // bit pattern 0xxxxxxx
                strbuf += (String.fromCharCode(buf [i++] & 0xFF));
            else if ((buf [i] & 0xE0) === 0xC0) {  // bit pattern 110xxxxx
                if (i + 1 >= buf.length || (buf [i + 1] & 0xC0) !== 0x80)
                    throw new Error("UTFDataFormatException");
                
                strbuf += (String.fromCharCode(((buf [i++] & 0x1F) << 6) | (buf [i++] & 0x3F)));
            } else if ((buf [i] & 0xF0) === 0xE0) {  // bit pattern 1110xxxx
                if (i + 2 >= buf.length || (buf [i + 1] & 0xC0) !== 0x80 || (buf [i + 2] & 0xC0) !== 0x80)
                    throw new Error("UTFDataFormatException");
                
                strbuf += (String.fromCharCode(((buf [i++] & 0x0F) << 12) | ((buf [i++] & 0x3F) << 6) | (buf [i++] & 0x3F)));
            } else // must be ((buf [i] & 0xF0) == 0xF0 || (buf [i] & 0xC0) == 0x80)
                throw new Error("UTFDataFormatException");    // bit patterns 1111xxxx or 10xxxxxx
        }
        return strbuf;
    }
    remaining() {
        return this.bytes.length;
    }
}