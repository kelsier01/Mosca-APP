import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useSocketIO = (serverUrl: string) => {
    const socket = ref<Socket | null>(null);
    const mensaje = ref<any>(null); // Almacena el último mensaje recibido

    // Conectar al servidor
    onMounted(() => {
        socket.value = io(serverUrl, {
            transports: ['websocket'], // Usar solo WebSocket
            reconnection: true, // Reconexión automática
            reconnectionAttempts: 5, // Intentos de reconexión
            reconnectionDelay: 1000, // Retardo entre reconexiones
        });

        // Escuchar eventos del servidor
        socket.value.on('connect', () => {
            console.log('Conectado al servidor Socket.IO');
        });

        socket.value.on('nuevaAlerta', (data: any) => {
            console.log('Nueva alerta recibida:', data);
            mensaje.value = { tipo: 'nuevaAlerta', data }; // Actualizar el mensaje
        });

        socket.value.on('disconnect', () => {
            console.log('Desconectado del servidor Socket.IO');
        });

        socket.value.on('connect_error', (error: any) => {
            console.error('Error de conexión:', error);
        });
    });

    // Desconectar al desmontar el componente
    onUnmounted(() => {
        if (socket.value) {
            socket.value.disconnect();
        }
    });

    return { mensaje };
};