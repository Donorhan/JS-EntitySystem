import {Entity} from './Entity.js'
import {EntityEvent} from './EntityEvent.js'
import {UUID} from './UUID.js'

/**
 * A World: Manage entities, systems and components.
 *
 * @author Donovan ORHAN <dono.orhan@gmail.com>
 */
export class World
{
    /**
     * Constructor
     */
    constructor()
    {
        /**
         * Function to call when an entity is created
         *
         * @type {Function}
         */
        this.callbackCreation = null;

        /**
         * Array of Component
         *
         * - Key is the entity's id
         * - Value is an Array of Component with key = Component UID
         *
         * @type {Array.<Array.<Component>>}
         */
        this.components = [];

        /**
         * An array of Entity instance
         *
         * @type {Array.<Entity>}
         * @private
         */
        this.entities = [];

        /**
         * Events waiting to be processed
         *
         * @type {Array.<Event>}
         * @private
         */
        this.waitingEvents = [];

        /**
         * Array of entities waiting to be added to the systems
         *
         * @type {Array.<Entity>}
         */
        this.waitingAddUpdate = [];

        /**
         * Array of entities waiting to be added to the systems
         *
         * @type {Array.<Entity>}
         */
        this.waitingRemoveUpdate = [];

        /**
         * Array of System
         *
         * @type {Array.<System>}
         * @private
         */
        this.systems = [];

        /**
         * Array with entities names
         *
         * @type {Array.<Entity>}
         * @private
         */
        this.entitiesNames = [];
    }

    /**
     * Clear the world
     *
     * Remove entities, components and systems
     */
    clear()
    {
        this.removeEntities();

        for (let i = 0; i < this.systems.length; i++)
            this.systems[i].onInactivation();

        this.systems.length = 0;
    }

    /**
     * Remove all entities
     */
    removeEntities()
    {
        for (let i = 0; i < this.systems.length; i++)
        {
            this.systems[i].onClear();

            for (let j = 0; j < this.systems[i].entities.length; j++)
                this.systems[i].removeEntity(this.systems[i].entities[j]);

            this.systems[i].entities.length = 0;
        }

        this.entities.length = 0;
        this.components.length = 0;
        this.entitiesNames.length = 0;
        this.waitingRemoveUpdate.length = 0;
        this.waitingAddUpdate.length = 0;
        this.waitingEvents.length = 0;
    }

    /**
     * Create a new entity
     *
     * @return {Entity} An Entity instance
     */
    createEntity()
    {
        let entity = new Entity(this);
        this.entities.push(entity);

        if (this.callbackCreation) {
            this.callbackCreation(entity);
        }

        return entity;
    }

    /**
     * Destroy the given entity
     *
     * @param {Entity} entity An Entity instance
     */
    destroyEntity(entity)
    {
        // Removes components
        this.waitingRemoveUpdate.push({ entity: entity, components : [] }); // Empty array = Remove all components

        // Set the name as free
        for (let i in this.entitiesNames)
            if (this.entitiesNames[i] == entity)
                this.entitiesNames[i] = null;
    }

    /**
     * Add a system
     *
     * @param {System} system A System instance
     */
    addSystem(system)
    {
        system.world = this;
        system.onActivation();
        this.systems.push(system);
    }

    /**
     * World's entry point
     *
     * @param {number} deltaTime Time elapsed since the last update
     */
    update(deltaTime)
    {
        /*
         * Add/Remove components from entities
         */
        for (let i = 0; i < this.waitingEvents.length; i++)
        {
            let event = this.waitingEvents[i];
            let components = this.components[event.entity.id] || [];

            switch (event.type)
            {
                case EntityEvent.Type.AddComponent:
                {
                    // "AddComponent" event is processed directly
                    this.waitingAddUpdate[event.entity.id] = event.entity;
                    break;
                }
                case EntityEvent.Type.RemoveComponent:
                {
                    let uid = UUID.get(event.component);
                    if (components[uid])
                    {
                        // "RemoveComponent" event is processed later to avoid bugs
                        this.waitingRemoveUpdate[event.entity.id] = this.waitingRemoveUpdate[event.entity.id] || { entity : event.entity, components : [] };

                        // Add component ID to the list of components to remove
                        this.waitingRemoveUpdate[event.entity.id].components.push(uid);
                    }

                    break;
                }
            }

            this.components[event.entity.id] = components;
        }
        this.waitingEvents = [];

        /*
         * Register entities in Systems
         */
        for (let entityID in this.waitingAddUpdate)
        {
            let components  = this.components[entityID];
            let token       = 0;

            // Update key
            for (let UID in components)
                if(components[UID])
                    token |= UID;

            // Register entity in systems
            for (let i = 0; i < this.systems.length; i++)
                if (this.systems[i].key != 0 && ((token & this.systems[i].key) == this.systems[i].key))
                    this.systems[i].addEntity(this.waitingAddUpdate[entityID]);
        }
        this.waitingAddUpdate.length = 0;

        /*
         * Remove waiting entities from Systems
         */
        for (let i in this.waitingRemoveUpdate)
        {
            let removeData = this.waitingRemoveUpdate[i];

            // Ask to remove everything
            if (removeData.components.length == 0)
            {
                // Remove entity from systems
                for (let i = 0; i < this.systems.length; i++)
                    if (this.systems[i].isPresent(removeData.entity))
                        this.systems[i].removeEntity(removeData.entity);

                // Remove components
                for (let i in this.components[removeData.entity.id])
                    delete this.components[removeData.entity.id][i];

                this.components[removeData.entity.id].length = 0;
            }
            else 
            {
                let components  = this.components[removeData.entity.id];
                let token       = 0;

                // Update key
                for (let UID in components)
                    if(components[UID])
                        token |= UID;

                // Remove entity from systems
                for (let i = 0; i < this.systems.length; i++)
                    if (this.systems[i].isPresent(removeData.entity) && (token & this.systems[i].key) != this.systems[i].key)
                        this.systems[i].removeEntity(removeData.entity);

                // Remove components
                for (let i in removeData.components)
                {
                    delete components[i];
                    components[i] = null;
                }
            }
        }
        this.waitingRemoveUpdate.length = 0;

        /*
         * Update Systems
         */
        for (let i = 0; i < this.systems.length; i++)
            if (this.systems[i].enabled)
                this.systems[i].update(deltaTime);
    }

    /**
     * Send an event to the Systems
     *
     * @param {Event} event An Event instance
     */
    sendEvent(event)
    {
        // Process EntityEvent here
        if (event instanceof EntityEvent)
        {
            // Add component directly to the entity
            if (event.type == EntityEvent.Type.AddComponent)
            {
                let uid = UUID.get(event.component.constructor);
                let entityComponents = this.components[event.entity.id] || [];
                entityComponents[uid] = event.component;
                this.components[event.entity.id] = entityComponents;
            }

            this.waitingEvents[this.waitingEvents.length] = event;
        }

        // Send the event to the systems.
        for (let i = 0; i < this.systems.length; i++)
            this.systems[i].onEvent(event);
    }

    /**
     * Tag an entity with a name
     *
     * If an entity with the same exist, the previous one will be unnamed
     *
     * @param {string} name A string representing the name to assign
     * @param {Entity} entity An Entity instance
     */
    setEntityName(name, entity)
    {
        this.entitiesNames[name] = entity;
    }

    /**
     * Get an entity's components
     *
     * @param {Entity} entity An Entity instance
     * @return {Array} An array of Component
     */
    getComponents(entity)
    {
        return this.components[entity.id] || [];
    }

    /**
     * Get an entity's component
     *
     * @param {Entity} entity An Entity instance
     * @param {Component} componentUID A Component prototype
     * @return {Component|null} A Component instance or null
     */
    getComponent(entity, componentUID)
    {
        let components = this.getComponents(entity);
        if (!components)
            return null;

        return components[UUID.get(componentUID)] || null;
    }

    /**
    * Get a system
    *
    * @param {Function} className The name of the class
    * @return {System|null} A System instance or null
    */
    getSystem(className)
    {
        for (let i = 0; i < this.systems.length; i++)
            if (this.systems[i] instanceof className)
                return this.systems[i];

        return null;
    }

    /**
     * Get entity with the given name
     *
     * @param {string} name A string representing the name to assign
     * @return {Entity|null} An Entity instance or null
     */
    getEntityWithName(name)
    {
        return this.entitiesNames[name] || null;
    }

    /**
     * Set callback
     *
     * @param {Function<Entity>}
     * @private
     */
    onEntityCreated(callback)
    {
        this.callbackCreation = callback;
    }
}