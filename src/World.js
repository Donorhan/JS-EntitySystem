'use strict';

/**
* A World: Manage entities, systems and components.
* @constructor
*/
ES.World = function()
{
    /**
    * Array of ES.Component.
    *
    * - Key is the entity's id.
    * - Value is an Array of ES.Component with key = ES.Component UID.
    *
    * @type {Array.<Number>}
    */
    this.components = [];

    /**
    * An array of ES.Entity instance.
    * @type {Array.<ES.Entity>}
    * @private
    */
    this.entities = [];

    /**
    * Events waiting to be processed.
    * @type {Array.<ES.Event>}
    * @private
    */
    this.waitingEvents = [];

    /**
    * Array of entities waiting to be added to the systems.
    * @type {Array.<Number>}
    */
    this.waitingAddUpdate = [];

    /**
    * Array of entities waiting to be added to the systems.
    * @type {Array.<Number>}
    */
    this.waitingRemoveUpdate = [];

    /**
    * Array of ES.System.
    * @type {Array.<ES.System>}
    * @private
    */
    this.systems = [];

    /**
    * Array with entities names.
    * @type {Array.<String, {ES.Entity}>}
    * @private
    */
    this.entitiesNames = [];
}

/**
* Clear the world.
* Remove entities, components and systems.
*/
ES.World.prototype.clear = function()
{
    this.removeEntities();
    this.systems = [];
};

/**
* Remove all entities.
*/
ES.World.prototype.removeEntities = function()
{
    for( var i = 0; i < this.systems.length; i++ )
        this.systems[i].entities = [];

    this.entities               = [];
    this.components             = [];
    this.tags                   = [];
    this.waitingRemoveUpdate    = [];
    this.waitingAddUpdate       = [];
    this.waitingEvents          = [];
};

/**
* Create a new entity.
* @return {ES.Entity} An ES.Entity instance.
*/
ES.World.prototype.createEntity = function()
{
    var entity = new ES.Entity(this);
    this.entities[this.entities.length] = entity;

    return entity;
};

/**
* Add a system.
* @param {ES.System} system A ES.System instance.
*/
ES.World.prototype.addSystem = function( system )
{
    system.world = this;
    this.systems[this.systems.length] = system;
};

/**
* World's entry point.
* @param {Number} deltaTime Time elapsed since the last update.
*/
ES.World.prototype.update = function( deltaTime )
{
    var toUpdate = [];

    /*
    * Add/Remove components from entities.
    */
    for( var i = 0; i < this.waitingEvents.length; i++ )
    {
        var event       = this.waitingEvents[i];
        var components  = this.components[event.entity.id] || [];

        switch( event.type )
        {
            case ES.EntityEvent.Type.AddComponent:
            {
                components[event.component.UID]                 = event.component;
                this.waitingAddUpdate[event.entity.id]          = event.entity;
                break;
            }
            case ES.EntityEvent.Type.RemoveComponent:
            {
                if( components[event.component.UID] )
                {
                    delete components[event.component.UID];
                    components[event.component.UID]             = null;
                    this.waitingRemoveUpdate[event.entity.id]   = event.entity;
                }

                break;
            }
        }

        this.components[event.entity.id] = components;
    }

    /*
    * Register entities in Systems.
    */
    for( var entityID in this.waitingAddUpdate )
    {
        var components  = this.components[entityID];
        var token       = 0;

        // Update key.
        for( var UID in components )
            if( components[UID] )
                token |= UID;

        // Register entity in systems.
        for( var i = 0; i < this.systems.length; i++ )
            if( this.systems[i].key != 0 && ((token & this.systems[i].key) == this.systems[i].key) )
                this.systems[i].addEntity( this.waitingAddUpdate[entityID] );
    }

    /*
    * Remove waiting entities from Systems.
    */
    for( var entityID in this.waitingRemoveUpdate )
    {
        var components  = this.components[entityID];
        var token       = 0;

        // Update key.
        for( var UID in components )
            if( components[UID] )
                token |= UID;

        // Remove entity from systems.
        for( var i = 0; i < this.systems.length; i++ )
            if( this.systems[i].isPresent(this.waitingRemoveUpdate[entityID]) && (token & this.systems[i].key) != this.systems[i].key )
                this.systems[i].removeEntity( this.waitingRemoveUpdate[entityID] );
    }

    /*
    * Update Systems.
    */
    for( var i = 0; i < this.systems.length; i++ )
        if( this.systems[i].enabled )
            this.systems[i].update(deltaTime);

    // Clear arrays.
    this.waitingEvents          = [];
    this.waitingAddUpdate       = [];
    this.waitingRemoveUpdate    = [];
};

/**
* Send an event to the Systems.
* @param {ES.Event} event An ES.Event instance.
*/
ES.World.prototype.sendEvent = function( event )
{
    // Process ES.EntityEvent here.
    if( event instanceof ES.EntityEvent )
        this.waitingEvents[this.waitingEvents.length] = event;

    // Send the event to the systems.
    for( var i = 0; i < this.systems.length; i++ )
        this.systems[i].onEvent(event);
};

/**
* Tag an entity with a name.
*
* If an entity with the same exist, the previous one will be unnamed.
*
* @param {String} name A String representing the name to assign.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.World.prototype.setEntityName = function( name, entity )
{
    this.entitiesNames[name] = entity;
};

/**
* Get an entity's components.
* @param {ES.Entity} entity An ES.Entity instance.
* @return {Array} An array of ES.Component.
*/
ES.World.prototype.getComponents = function( entity )
{
    return this.components[entity.id] || [];
};

/**
* Get an entity's component.
* @param {ES.Entity} entity An ES.Entity instance.
* @param {ES.Component} componentUID An ES.Component prototype.
* @return {ES.Component|null} An ES.Component instance or null.
*/
ES.World.prototype.getComponent = function( entity, componentUID )
{
    var components = this.getComponents(entity);
    if( components )
        return components[componentUID.prototype.UID] || null;

    return null;
};

/**
* Get entity with the given name.
* @param {String} name A String representing the name to assign.
* @return {ES.Entity|null} An ES.Entity instance or null.
*/
ES.World.prototype.getEntityWithName = function( name )
{
    return this.entitiesNames[name] || null;
};
