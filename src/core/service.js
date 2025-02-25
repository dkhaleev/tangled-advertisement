import api from '../api/server';
import database from '../database/database';
import network from '../network/network';
import peer from '../network/peer';


class Service {
    constructor() {
        this.initialized = false;
    }

    initialize(options = {}) {
        if (this.initialized) {
            return Promise.resolve();
        }
        this.initialized = true;
        return database.initialize()
                       .then(() => database.checkup())
                       .then(() => network.initialize())
                       .then(() => peer.initialize())
                       .then(() => api.initialize())
                       .catch(e => {
                           console.log(`[service] ${e.message}`);
                           this.initialized = false;
                           return new Promise(resolve => setTimeout(() => this.initialize(options).then(resolve), 5000));
                       });
    }

    stop() {
        if (!this.initialized) {
            return;
        }
        this.initialized = false;
    }
}


export default new Service();
