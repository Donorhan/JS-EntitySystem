goog.provide('ES.World');
goog.require('ES.Component');
goog.require('ES.Entity');
goog.require('ES.Event');
goog.require('ES.System');

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
    * @type {Array.<Array.<ES.Component>>}
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
    * @type {Array.<ES.Entity>}
    */
    this.waitingAddUpdate = [];

    /**
    * Array of entities waiting to be added to the systems.
    * @type {Array.<Object>}
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
    * @type {Array.<ES.Entity>}
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

    for( var i = 0; i < this.systems.length; i++ )
        this.systems[i].onInactivation();

    this.systems.length = 0;
};

/**
* Remove all entities.
*/
ES.World.prototype.removeEntities = function()
{
    for( var i = 0; i < this.systems.length; i++ )
    {
        this.systems[i].onClear();

        for( var j = 0; j < this.systems[i].entities.length; j++ )
            this.systems[i].removeEntity(this.systems[i].entities[j]);

        this.systems[i].entities.length = 0;
    }

    this.entities.length                = 0;
    this.components.length              = 0;
    this.entitiesNames.length           = 0;
    this.waitingRemoveUpdate.length     = 0;
    this.waitingAddUpdate.length        = 0;
    this.waitingEvents.length           = 0;
};

/**
* Create a new entity.
* @return {ES.Entity} An ES.Entity instance.
*/
ES.World.prototype.createEntity = function()
{
    var entity = new ES.Entity(this);
    this.entities.push(entity);

    return entity;
};

/**
* Destroy the given entity.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.World.prototype.destroyEntity = function( entity )
{
    // Removes components.
    this.waitingRemoveUpdate.push({ entity: entity, components : [] }); // Empty array = Remove all components.

    // Set the name as free.
    for( var i in this.entitiesNames )
        if( this.entitiesNames[i] == entity )
            this.entitiesNames[i] = null;
};

/**
* Add a system.
* @param {ES.System} system A ES.System instance.
*/
ES.World.prototype.addSystem = function( system )
{
    system.world = this;
    system.onActivation();
    this.systems.push(system);
};

/**
* World's entry point.
* @param {number} deltaTime Time elapsed since the last update.
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
                // "AddComponent" event is processed directly.
                this.waitingAddUpdate[event.entity.id] = event.entity;
                break;
            }
            case ES.EntityEvent.Type.RemoveComponent:
            {
                if( components[event.component.UID] )
                {
                    // "RemoveComponent" event is processed later to avoid bugs.
                    this.waitingRemoveUpdate[this.waitingRemoveUpdate.length] = this.waitingRemoveUpdate[event.entity.id] || { entity: event.entity, components : [] };

                    // Add component ID to the list of components to remove.
                    this.waitingRemoveUpdate[event.entity.id].components.push(event.component.UID);
                }

                break;
            }
        }

        this.components[event.entity.id] = components;
    }
    this.waitingEvents = [];

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
    this.waitingAddUpdate.length = 0;

    /*
    * Remove waiting entities from Systems.
    */
    for( var i = 0; i < this.waitingRemoveUpdate.length; i++ )
    {
        var removeData = this.waitingRemoveUpdate[i];

        // Ask to remove everything.
        if( removeData.components.length == 0 )
        {
            // Remove entity from systems.
            for( var i = 0; i < this.systems.length; i++ )
                if( this.systems[i].isPresent(removeData.entity) )
                    this.systems[i].removeEntity(removeData.entity);

            // Remove components.
            for( var i in this.components[removeData.entity.id] )
                delete this.components[removeData.entity.id][i];

            this.components[removeData.entity.id].length = 0;
        }
        else 
        {
            var components  = this.components[removeData.entity.id];
            var token       = 0;

            // Update key.
            for( var UID in components )
                if( components[UID] )
                    token |= UID;

            // Remove entity from systems.
            for( var i = 0; i < this.systems.length; i++ )
                if( this.systems[i].isPresent(removeData.entity) && (token & this.systems[i].key) != this.systems[i].key )
                    this.systems[i].removeEntity(removeData.entity);

            // Remove components.
            for( var i in removeData.components )
            {
                delete components[i];
                components[i] = null;
            }
        }
    }
    this.waitingRemoveUpdate.length = 0;

    /*
    * Update Systems.
    */
    for( var i = 0; i < this.systems.length; i++ )
        if( this.systems[i].enabled )
            this.systems[i].update(deltaTime);
};

/**
* Send an event to the Systems.
* @param {ES.Event} event An ES.Event instance.
*/
ES.World.prototype.sendEvent = function( event )
{
    // Process ES.EntityEvent here.
    if( event instanceof ES.EntityEvent )
    {
        // Add component directly to the entity.
        if( event.type == ES.EntityEvent.Type.AddComponent )
        {
            var entityComponents = this.components[event.entity.id] || [];
            entityComponents[event.component.UID] = event.component;
            this.components[event.entity.id] = entityComponents;
        }

        this.waitingEvents[this.waitingEvents.length] = event;
    }

    // Send the event to the systems.
    for( var i = 0; i < this.systems.length; i++ )
        this.systems[i].onEvent(event);
};

/**
* Tag an entity with a name.
*
* If an entity with the same exist, the previous one will be unnamed.
*
* @param {string} name A string representing the name to assign.
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
* Get a system.
* @param {Function} className The name of the class.
* @return {ES.System|null} An ES.System instance or null.
*/
ES.World.prototype.getSystem = function( className )
{
    for( var i = 0; i < this.systems.length; i++ )
        if( this.systems[i] instanceof className )
            return this.systems[i];

    return null;
};

/**
* Get entity with the given name.
* @param {string} name A string representing the name to assign.
* @return {ES.Entity|null} An ES.Entity instance or null.
*/
ES.World.prototype.getEntityWithName = function( name )
{
    return this.entitiesNames[name] || null;
};
