/**
 * This is a JavaScript translation of Java's DataOutputStream
 * Java source from https://developer.classpath.org/doc/java/io/DataOutputStream-source.html
 * Java's source, and hence this source, is licensed under GPL2
 * The classpath exception still applies
 * Refer to DataIOLicense.txt for a copy of GPL2
 */
class DataOutputStream {
    constructor() {
        this.bytes = [];
    }
    write(value) {
        this.bytes.push(value);
    }
    writeBuffer(buf, offset, len) {
        for (var i = 0; i < len; i++)
            this.writeByte(buf[offset + i]);
    }
    writeBoolean(value) {
        this.write(value ? 1 : 0);
    }
    writeByte(value) {
        this.write(Math.floor(value) & 0xFF);
    }
    writeShort(value) {
        this.writeByte(value >> 8);
        this.writeByte(value);
    }
    writeChar(value) {
        this.writeShort(value.charCodeAt(0));
    }
    writeInt(value) {
        this.writeByte(value >> 24);
        this.writeByte(value >> 16);
        this.writeByte(value >> 8);
        this.writeByte(value);
    }
    writeLong(value) {
        var view = new DataView(new ArrayBuffer(8));
        view.setBigInt64(0, value);
        for (var i = 0; i < 8; i++)
            this.writeByte(view.getUint8(i));
    }
    writeFloat(value) {
        var view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, value);
        for (var i = 0; i < 4; i++)
            this.writeByte(view.getUint8(i));
    }
    writeDouble(value) {
        var view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, value);
        for (var i = 0; i < 8; i++)
            this.writeByte(view.getUint8(i));
    }
    writeBytes(value) {
        for (var c of value)
            this.writeByte(c);
    }
    writeChars(value) {
        for (var c of value)
            this.writeChar(c);
    }
    writeUTF(value) {
        var len = value.length;
        var i = 0;
        var pos = 0;
        var lengthWritten = false;
        var buf = []; buf.length = 512;
        
        do {
            while (i < len && pos < buf.length - 3) {
                var c = value.charAt(i++);
                var cint = c.charCodeAt(0);
                if (c >= '\u0001' && c <= '\u007f')
                    buf[pos++] = cint;
                else if (c == '\u0000' || (c >= '\u0080' && c <= '\u07ff')) {
                    buf[pos++] = (0xc0 | (0x1f & (cint >> 6)));
                    buf[pos++] = (0x80 | (0x3f & cint));
                } else {
                    // JSL says the first byte should be or'd with 0xc0, but
                    // that is a typo.  Unicode says 0xe0, and that is what is
                    // consistent with DataInputStream.
                    buf[pos++] = (0xe0 | (0x0f & (cint >> 12)));
                    buf[pos++] = (0x80 | (0x3f & (cint >> 6)));
                    buf[pos++] = (0x80 | (0x3f & cint));
                }
            }
            if (!lengthWritten) {
                if (i == len)
                    this.writeShort(pos);
                else
                    this.writeShort(this.getUTFlength(value, i, pos));
                lengthWritten = true;
            }
            this.writeBuffer(buf, 0, pos);
            pos = 0;
        } while (i < len);
    }
    getUTFlength(value, start, sum) {
        var len = value.length;
        
        for (var i = start; i < len && sum <= 65535; ++i) {
            var c = value.charAt(i);
            if (c >= '\u0001' && c <= '\u007f')
                sum += 1;
            else if (c == '\u0000' || (c >= '\u0080' && c <= '\u07ff'))
                sum += 2;
            else
                sum += 3;
        }
        
        if (sum > 65535)
            throw new Error("UTFDataFormatException");
        
        return sum;
    }
    length() {
        return this.bytes.length;
    }
}