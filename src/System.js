import {UUID} from './UUID.js'

/**
 * A System : Contains a list of entities to work with
 *
 * @author Donovan ORHAN <dono.orhan@gmail.com>
 */
export class System
{
    /**
     * Constructor
     *
     * @param {Array.<Component>=} requires An Array of Component
     */
    constructor(requires)
    {
        /**
         * An array of Entity instance
         *
         * @type {Array.<Entity>}
         */
        this.entities = [];

        /**
         * A boolean representing System's state
         *
         * @type {boolean}
         */
        this.enabled = true;

        /**
         * Computed key: using a bitwise operation with Component's UID
         *
         * @type {number}
         */
        this.key = 0;

        /**
         * A reference to the parent world
         *
         * @type {World}
         */
        this.world = null;

        // Compute key
        if (requires)
        {
            for (let i = 0; i < requires.length; i++)
                this.key = this.key | UUID.get(requires[i]);
        }
    }

    /**
     * Call when an entity is added to the system
     *
     * @param {Entity} entity An Entity instance
     */
    addEntity(entity)
    {
        this.entities.push(entity);
        this.onEntityAdded(entity);
    }

    /**
     * Call when an entity is removed from the system
     *
     * @param {Entity} entity An Entity instance
     */
    removeEntity(entity)
    {
        let index = this.entities.indexOf(entity);
        if (index > -1)
        {
            this.entities.splice(index, 1);
            this.onEntityRemoved(entity);
        }
    }

    /**
     * Check if given entity is present is the system
     *
     * @param {Entity} entity An Entity instance
     * @return {boolean} True if entity is present, otherwise false
     */
    isPresent(entity)
    {
        return (this.entities.indexOf(entity) > -1);
    }

    /**
     * Enable/disable the system
     *
     * @param {boolean} value A boolean value
     */
    setActif(value)
    {
        this.enabled = value;
    }

    /**
     * System's entry point
     *
     * @param {number} deltaTime Time elasped since the last update
     */
    update(deltaTime) { };

    /**
     * Call when system is activated
     */
    onActivation() { };

    /**
     * Call when system is inactivated
     */
    onInactivation() { };

    /**
     * Call when an entity is added to the system
     *
     * @param {Entity} entity An Entity instance
     */
    onEntityAdded(entity) { };

    /**
     * Call when an entity is removed from the system
     *
     * @param {Entity} entity An Entity instance.
     */
    onEntityRemoved(entity) { };

    /**
     * Call when the system is clear
     */
    onClear() { };

    /**
     * Call when an event is send
     *
     * @param {Event} event An Event instance
     */
    onEvent(event) { };
}
