import {EntityEvent} from './EntityEvent.js'

/**
 * An Entity: A simple identifier with some shortcuts.
 *
 * @author Donovan ORHAN <dono.orhan@gmail.com>
 */
export class Entity
{
    /**
     * Constructor
     *
     * @param {World} world Parent World instance
     */
    constructor(world)
    {
        /**
         * Unique ID
         *
         * @type {number}
         */
        this.id = Entity.nextID++;

        /**
         * A reference to the parent world
         *
         * @type {World}
         */
        this.world = world;
    }

    /**
     * Add a component to the entity
     *
     * @param {Component} component The component instance to add
     */
    addComponent(component)
    {
        this.world.sendEvent(new EntityEvent(this, EntityEvent.Type.AddComponent, component));
    }

    /**
     * Remove a component
     *
     * @param {ES.Component} component The component instance to remove
     */
    removeComponent(component)
    {
        this.world.sendEvent(new EntityEvent(this, EntityEvent.Type.RemoveComponent, component));
    }

    /**
     * Set name
     *
     * @param {string} name A string representing the name to assign
     */
    setName(name)
    {
        this.world.setEntityName(name, this);
    }

    /**
     * Get components
     *
     * @return {Array.<Component>}
     */
    getComponents()
    {
        return this.world.getComponents(this);
    }

    /**
     * Get a component
     *
     * @param {Component} component A component instance
     * @return {Component|null}
     */
    getComponent(component)
    {
        return this.world.getComponent(this, component);
    }
}

/**
 * Used to identify next identifier available
 *
 * @type {number}
 */
Entity.nextID = 0;