class PacketRegistry {
    constructor() {
        this.packetTypes = [];
        this.registerPacket(PrimitivePacket);
    }
    registerPacket(packetType) {
        if (this.packetTypes.includes(packetType))
            return;
        this.packetTypes.push(packetType);
    }
    registerPackets(registry) {
        for (var packetType of registry.packetTypes)
            this.registerPacket(packetType);
    }
    getPacketId(packet) {
        var clazz = null;
        var id = 0;
        for (var i = 0; i < this.packetTypes.length; i++) {
            var packetType = this.packetTypes[i];
            if (packet instanceof packetType && (clazz === null || packetType.prototype instanceof clazz)) {
                clazz = packetType;
                id = i;
            }
        }
        if (clazz === null)
            throw new Error("The packet type " + packet.constructor.name + " is not registered!");
        return id;
    }
    getPacketType(id) {
        if (id < 0 || id >= this.packetTypes.length)
            return null;
        return this.packetTypes[id];
    }
}