let device, server, service, characteristic;

document.getElementById("connectButton").addEventListener("click", async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["battery_service"]
        });
        server = await device.gatt.connect();
        document.getElementById("status").textContent = "Estado: Conectado a " + device.name;
    } catch (error) {
        console.error(error);
        document.getElementById("status").textContent = "Estado: Error de conexión";
    }
});

document.querySelectorAll(".control-btn").forEach(button => {
    button.addEventListener("click", async () => {
        const command = button.getAttribute("data-command");
        if (server) {
            try {
                service = await server.getPrimaryService("battery_service");
                characteristic = await service.getCharacteristic("00002a19-0000-1000-8000-00805f9b34fb");
                const encoder = new TextEncoder();
                await characteristic.writeValue(encoder.encode(command));
                document.getElementById("status").textContent = "Estado: Comando enviado: " + command;
            } catch (error) {
                console.error(error);
                document.getElementById("status").textContent = "Estado: Error al enviar comando";
            }
        } else {
            document.getElementById("status").textContent = "Estado: No conectado";
        }
    });
});
