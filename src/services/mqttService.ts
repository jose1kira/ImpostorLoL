import mqtt, { MqttClient } from 'mqtt';
import { GameState, Player } from '../types/game';

class MQTTService {
  private client: MqttClient | null = null;

  private messageHandlers: Map<string, (message: any) => void> = new Map();

  // Using a public MQTT broker for demo purposes
  private readonly BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
  private readonly GLOBAL_LOBBY_TOPIC = 'impostor-lol/global-lobby';

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(this.BROKER_URL, {
        clientId: `impostor-lol-${Date.now()}`,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      });

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        this.subscribeToGlobalLobby();
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
        reject(error);
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed');
      });
    });
  }

  private subscribeToGlobalLobby() {
    if (!this.client) return;

    this.client.subscribe(this.GLOBAL_LOBBY_TOPIC, (err) => {
      if (err) {
        console.error(`Failed to subscribe to global lobby:`, err);
      } else {
        console.log(`Subscribed to global lobby`);
      }
    });
  }

  private handleMessage(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());
      
      if (topic === this.GLOBAL_LOBBY_TOPIC) {
        if (data.type === 'gameState') {
          this.notifyHandlers('gameState', data.data);
        } else if (data.type === 'playerJoined') {
          this.notifyHandlers('playerJoined', data.data);
        } else if (data.type === 'playerLeft') {
          this.notifyHandlers('playerLeft', data.data);
        }
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  publishGameState(gameState: GameState) {
    this.publish(this.GLOBAL_LOBBY_TOPIC, {
      type: 'gameState',
      data: gameState
    });
  }

  publishPlayerJoined(player: Player) {
    this.publish(this.GLOBAL_LOBBY_TOPIC, {
      type: 'playerJoined',
      data: player
    });
  }

  publishPlayerLeft(playerId: string) {
    this.publish(this.GLOBAL_LOBBY_TOPIC, {
      type: 'playerLeft',
      data: { playerId }
    });
  }

  private publish(topic: string, message: any) {
    if (this.client && this.client.connected) {
      // Use QoS 1 for reliable delivery of important game state messages
      const qos = message.type === 'gameState' ? 1 : 1;
      this.client.publish(topic, JSON.stringify(message), { qos });
      console.log(`Published ${message.type} message to ${topic}`);
    } else {
      console.warn('Cannot publish message: MQTT client not connected');
    }
  }

  on(event: string, handler: (message: any) => void) {
    this.messageHandlers.set(event, handler);
  }

  private notifyHandlers(event: string, message: any) {
    const handler = this.messageHandlers.get(event);
    if (handler) {
      handler(message);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const mqttService = new MQTTService();
export default mqttService;
