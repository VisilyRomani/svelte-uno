import injectSocketIO from './SocketHandler';
import type { ViteDevServer } from 'vite';

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		server.httpServer && injectSocketIO(server.httpServer);
	}
};
