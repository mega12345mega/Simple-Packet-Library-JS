class Connection extends PacketRegistry {
    constructor(packetListeners) {
        super();
        this.packetListeners = packetListeners;
        this.timeout = 5000;
        this.responseListeners = {};
        this.lastPacketId = -1;
        this.responseIds = new WeakMap();
    }
    start(socket) {
        this.socket = socket;
        socket.binaryType = "arraybuffer";
        socket.addEventListener("error", event => {
            console.error("WebSocket error: " + JSON.stringify(event, ["message", "arguments", "type", "name"]));
        });
        socket.addEventListener("message", event => {
            var buf = new DataInputStream(Array.from(event.data));
            
            // Read metadata
            var id = buf.readInt();
            var responseId = buf.readInt();
            var PacketType = this.getPacketType(buf.readInt());
            if (buf.readInt() != buf.remaining())
                throw new Error("Incoming packet is corrupted!");
            if (packetType === null)
                throw new Error("Unregistered packet type received!");
            
            // Read and handle packet
            var packet = new PacketType(buf);
            this.responseIds.set(packet, id);
            if (responseId != -1) {
                var listener = this.responseListeners[responseId];
                if (listener !== undefined && listener.key != -1 && listener.key < Date.now())
                    delete this.responseListeners[responseId];
                else if (listener !== undefined)
                    this.invokePacketListeners([listener.value], packet);
            } else
                this.invokePacketListeners(this.packetListeners, packet);
        });
    }
    invokePacketListeners(listeners, packet) {
        // Normally multithreaded
        // Thus, WaitState isn't nessesary
        for (var listener of listeners)
            listener(packet, this);
    }
    
    sendPacket_internal(packet, responseId, response) {
        if (this.socket === null || this.socket.readyState != 1)
            throw new Error("The connection isn't alive!");
        
        this.cleanResponseListeners();
        
        var id = ++this.lastPacketId;
        
        if (response !== null) {
            var packetTimeout = this.timeout == -1 ? -1 : Date.now() + this.timeout;
            this.responseListeners[id] = {key: packetTimeout, value: response};
        }
        
        var out = new DataOutputStream();
        out.writeInt(id);
        out.writeInt(responseId);
        out.writeInt(this.getPacketId(packet));
        var data = new DataOutputStream();
        packet.write(data);
        out.writeInt(data.length());
        for (var b of data.bytes)
            out.write(b);
        
        this.socket.send(new Uint8Array(out.bytes));
        
        return id;
    }
    sendPacket(packet, response) {
        return this.sendPacket_internal(packet, -1, response ?? null);
    }
    reply(toReply, packet, response) {
        return this.sendPacket_internal(packet, this.responseIds.get(toReply), response ?? null);
    }
    
    // sendPacketWithResponse not supported due to single threading
    // Use a callback instead
    
    setTimeout(timeout) {
        this.timeout = timeout;
    }
    getTimeout() {
        return this.timeout;
    }
    
    removeResponseListener(query) {
        if (query instanceof PacketListener) {
            var toRemove = [];
            for (var id in this.responseListeners) {
                if (this.responseListeners[id].value == query)
                    toRemove.push(id);
            }
            if (toRemove.length == 0)
                return false;
            for (var id of toRemove)
                delete this.responseListeners[id];
            return true;
        }
    }
    
    cleanResponseListeners() {
        var time = Date.now();
        var toRemove = [];
        for (var id in this.responseListeners) {
            if (this.responseListeners[id].key != -1 && this.responseListeners[id].key < time)
                toRemove.push(id);
        }
        for (var id of toRemove)
            delete this.responseListeners[id];
    }
    
    isAlive() {
        return this.socket != null && this.socket.readyState < 2;
    }
    
    close() {
        this.socket.close();
        this.responseListeners = {};
        this.responseIds = new WeakMap();
    }
    
    onClose() {}
}