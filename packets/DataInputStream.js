class DataInputStream {
    constructor(bytes) {
        this.bytes = bytes;
    }
    read() {
        return this.bytes.shift();
    }
    readBoolean() {
        var byte = this.read();
        if (byte === 1) return true;
        else if (byte === 0) return false;
        else throw new Error("Invalid boolean format! Expected a 1 or 0!");
    }
    readByte() {
        return this.read();
    }
    readShort() {
        return (this.read() << 8) + (this.read());
    }
    readChar() {
        return String.fromCharCode(this.readShort());
    }
    readInt() {
        return (this.read() << 24) + (this.read() << 16) + (this.read() << 8) + (this.read());
    }
    readLong() {
        return (this.read() << 56) + (this.read() << 48) + (this.read() << 40) + (this.read() << 32) + (this.read() << 24) + (this.read() << 16) + (this.read() << 8) + (this.read());
    }
    readFloat() {
        return this.intToFloat(this.readInt());
    }
    readDouble() {
        return this.longToDouble(this.readLong());
    }
    remaining() {
        return this.bytes.length;
    }
}