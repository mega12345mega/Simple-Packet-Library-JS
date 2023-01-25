<?php
header("Content-Type: application/javascript");
header("Access-Control-Allow-Origin: *");

require_once "PacketRegistry.js"; echo "\n";
require_once "Connection.js"; echo "\n";
require_once "Client.js"; echo "\n";

require_once "packets/DataInputStream.js"; echo "\n";
require_once "packets/DataOutputStream.js"; echo "\n";
require_once "packets/PrimitivePacket.js";
?>