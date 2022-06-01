class Client extends Connection {
    constructor(ip, port) {
        super([]);
        if (port === undefined) {
            this.ip = null;
            this.port = ip;
        } else {
            this.ip = ip;
            this.port = port;
        }
    }
    getIp() {
        return this.ip;
    }
    getPort() {
        return this.port;
    }
    addPacketListener(listener) {
        this.packetListeners.push(listener);
        return this;
    }
    removePacketListener(listener) {
        var i = this.packetListeners.indexOf(listener);
        if (i == -1) return false;
        this.packetListeners.remove(i);
        return true;
    }
    start() {
        if (this.isAlive())
            return this;
        
        super.start(new WebSocket((this.ip ?? "localhost") + ":" + this.port));
        return this;
    }
    isAlive() {
        return super.isAlive();
    }
}