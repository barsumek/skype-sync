// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import signalr = require('@aspnet/signalr');
import { Message } from '../models';
import { AddinsHub, SkypeSync } from '../interfaces';

/**
 * Addins hub is a socket server endpoint supporting the addins messaging needs
 * enabling generic infrastructure for addin context synchronization between addin session users
 * 
 * @export
 * @class AddinsHub
 */
export class SkypeHub implements AddinsHub {

    private hub: signalr.HubConnection;

    constructor(private syncSdk: SkypeSync) {
    }

    /**
     * Initialize the connection with the socket server endpoint 
     * located on a given endpoint
     * 
     * @param {string} url 
     * @returns {Promise<void>} 
     * @memberof AddinsHub
     */
    public connect(url: string): Promise<void> {

        this.hub = new signalr.HubConnection(url);

        this.hub.on('messageReceived', message => {
            console.log('[[SkypeSync][AddinsHub]:onMessageReceived]', message);
            this.syncSdk.messageHandler(message);
        });

        console.log('[SkypeSync][AddinsHub]::connect - hub:', url);

        return this.hub.start();
    }

    /**
     * Sends a message to the hub to the other users participating in the same addin session.
     * 
     * @param {Message} message 
     * @returns {Promise<void>} 
     * @memberof AddinsHub
     */
    public sendMessage(message: Message): Promise<void> {
        console.log('[SkypeSync][AddinsHub]::sendMessage', message);
        return this.hub.invoke('sendMessage', message);
    }

    /**
     * Sends a command to the hub to persist given addin session context for later use
     * 
     * @param {StoreContext} context 
     * @returns {Promise<void>} 
     * @memberof AddinsHub
     */
    public storeContext(context: string): Promise<void> {
        console.log('[SkypeSync][AddinsHub]::storeContext', context);
        return this.hub.invoke('storeContext', context);
    }

    /**
     * Retrieve previously persisted context from the hub.
     * 
     * @returns {Promise<string>} Previously persisted context (if any)
     * @memberof AddinsHub
     */
    public fetchContext(): Promise<string> {
        console.log('[SkypeSync][AddinsHub]::fetchContext');
        return this.hub.invoke('fetchContext');
    }
}
