class DataOutputStream {
    constructor() {
        this.bytes = [];
    }
    write(value) {
        this.bytes.push(value);
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
        this.writeByte(value >> 56);
        this.writeByte(value >> 48);
        this.writeByte(value >> 40);
        this.writeByte(value >> 32);
        this.writeByte(value >> 24);
        this.writeByte(value >> 16);
        this.writeByte(value >> 8);
        this.writeByte(value);
    }
    writeFloat(value) {
        this.writeInt(this.floatToInt(value));
    }
    writeDouble(value) {
        this.writeLong(this.doubleToLong(value));
    }
    writeBytes(value) {
        for (var c of value)
            this.writeByte(c);
    }
    writeChars(value) {
        for (var c of value)
            this.writeChar(c);
    }
    length() {
        return this.bytes.length;
    }
}