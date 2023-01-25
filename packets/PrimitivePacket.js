const NULL = 0;
const BOOLEAN = 1;
const BYTE = 2;
const SHORT = 3;
const CHAR = 4;
const INT = 5;
const LONG = 6;
const FLOAT = 7;
const DOUBLE = 8;
const STRING = 9;

class PrimitivePacket {
    constructor(value, type) {
        if (value instanceof DataInputStream) {
            this.type = type = value.read();
            this.value = (() => {
                switch (type) {
                    case 0: return null;
                    case 1: return value.readBoolean();
                    case 2: return value.readByte();
                    case 3: return value.readShort();
                    case 4: return value.readChar();
                    case 5: return value.readInt();
                    case 6: return value.readLong();
                    case 7: return value.readFloat();
                    case 8: return value.readDouble();
                    case 9: return value.readUTF();
                }
            })();
        } else
            this.setValue(value, type);
    }
    setValue(value, type) {
        this.value = value;
        this.type = type;
        if (value === null || value === undefined) {
            if (type != NULL)
                throw new Error("Value is null; type must be NULL");
            this.data = [0];
            return;
        }
        if (type == NULL)
            throw new Error("Type is NULL; value must be null");
        var out = new DataOutputStream();
        out.write(type);
        switch (type) {
            case 1:
                out.writeBoolean(value);
                break;
            case 2:
                out.writeByte(value);
                break;
            case 3:
                out.writeShort(value);
                break;
            case 4:
                out.writeChar(value);
                break;
            case 5:
                out.writeInt(value);
                break;
            case 6:
                out.writeLong(value);
                break;
            case 7:
                out.writeFloat(value);
                break;
            case 8:
                out.writeDouble(value);
                break;
            case 9:
                out.writeUTF(value);
                break;
            default:
                throw new Error("Only primitive data types and Strings are supported!");
        }
        this.data = out.bytes;
    }
    getValue() {
        return this.value;
    }
    getType() {
        return this.type;
    }
    write(out) {
        for (var b of this.data)
            out.writeByte(b);
    }
}