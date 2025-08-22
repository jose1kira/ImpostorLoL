import mqtt, { MqttClient } from 'mqtt';
import { GameState, Player } from '../types/game';

class MQTTService {
  private client: MqttClient | null = null;
  private gameId: string = '';

  private messageHandlers: Map<string, (message: any) => void> = new Map();

  // Using a public MQTT broker for demo purposes
  private readonly BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
  private readonly TOPIC_PREFIX = 'impostor-lol';

  connect(gameId: string, playerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.gameId = gameId;

      this.client = mqtt.connect(this.BROKER_URL, {
        clientId: `${this.TOPIC_PREFIX}-${playerId}-${Date.now()}`,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      });

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        this.subscribeToGameTopics();
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

  private subscribeToGameTopics() {
    if (!this.client) return;

    const topics = [
      `${this.TOPIC_PREFIX}/${this.gameId}/game`,
      `${this.TOPIC_PREFIX}/${this.gameId}/chat`,
      `${this.TOPIC_PREFIX}/${this.gameId}/players`,
    ];

    topics.forEach(topic => {
      this.client!.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());
      const topicType = topic.split('/').pop();

      if (topicType === 'game') {
        this.notifyHandlers('gameState', data);
      } else if (topicType === 'chat') {
        this.notifyHandlers('chat', data);
      } else if (topicType === 'players') {
        this.notifyHandlers('players', data);
      } else if (topicType === 'requestState') {
        this.notifyHandlers('requestState', data);
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  publishGameState(gameState: GameState) {
    this.publish(`${this.TOPIC_PREFIX}/${this.gameId}/game`, gameState);
  }

  publishChatMessage(message: any) {
    this.publish(`${this.TOPIC_PREFIX}/${this.gameId}/chat`, message);
  }

  publishPlayerUpdate(players: Player[]) {
    this.publish(`${this.TOPIC_PREFIX}/${this.gameId}/players`, players);
  }

  publishRequestState(request: any) {
    this.publish(`${this.TOPIC_PREFIX}/${this.gameId}/requestState`, request);
  }

  getTopicPrefix(): string {
    return this.TOPIC_PREFIX;
  }

  // Public publish method for custom topics
  publishToTopic(topic: string, message: any) {
    this.publish(topic, message);
  }

  private publish(topic: string, message: any) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, JSON.stringify(message), { qos: 1 });
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
