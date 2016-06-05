import {ESEvent} from './ESEvent.js'

/**
 * An EntityEvent
 *
 * @author Donovan ORHAN <dono.orhan@gmail.com>
 */
export class EntityEvent extends ESEvent
{
    /**
     * Constructor
     *
     * @param {Entity} entity An Entity instance
     * @param {EntityEvent.Type} type An EntityEvent.Type instance
     * @param {Component} component A Component instance
     */
    constructor(entity, type, component)
    {
        super();

        /**
         * The target
         *
         * @type {Entity}
         */
        this.entity = entity;

        /**
         * Entity's event type
         *
         * @type {EntityEvent.Type}
         */
        this.type = type;

        /**
         * Targted Component
         *
         * @type {Component}
         */
        this.component = component;
    }
}

/**
 * Used to identify next identifier available
 *
 * @type {number}
 */
EntityEvent.Type = {AddComponent: 0, RemoveComponent: 1};
