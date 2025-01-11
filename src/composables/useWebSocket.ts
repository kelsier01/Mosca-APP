// src/composables/useWebSocket.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useWebSocket(url: string) {
    const socket = ref<WebSocket | null>(null);
    const mensaje = ref<any>(null);

    const conectar = () => {
        socket.value = new WebSocket(url);

        socket.value.onopen = () => {
            console.log('Conexión WebSocket establecida');
        };

        socket.value.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            mensaje.value = data;
            console.log('Mensaje recibido:', data);
        };

        socket.value.onclose = () => {
            console.log('Conexión WebSocket cerrada');
        };

        socket.value.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };
    };

    const desconectar = () => {
        if (socket.value) {
            socket.value.close();
        }
    };

    onMounted(() => {
        conectar();
    });

    onUnmounted(() => {
        desconectar();
    });

    return { mensaje };
}