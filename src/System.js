goog.provide('ES.System');

/**
* A System.
*
* Contains a list of entities to work with.
*
* @param {Array.<Object>=} requires An Array of ES.Component prototype.
* @interface
* @constructor
*/
ES.System = function( requires )
{
    /**
    * An array of ES.Entity instance.
    * @type {Array.<ES.Entity>}
    */
    this.entities = [];

    /**
    * A boolean representing System's state. 
    * @type {boolean}
    */
    this.enabled = true;

    /**
    * Computed key: using a bitwise operation with ES.Component's UID. 
    * @type {boolean}
    */
    this.key = 0;

    /**
    * A reference to the parent world.
    * @type {ES.World}
    */
    this.world = null;

    // Compute key.
    if( requires )
        for( var i = 0; i < requires.length; i++ )
            this.key = this.key | requires[i].prototype.UID;
}

/**
* Call when an entity is added to the system.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.System.prototype.addEntity = function( entity )
{
    this.entities[this.entities.length] = entity;
    this.onEntityAdded(entity);
};

/**
* Call when an entity is removed from the system.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.System.prototype.removeEntity = function( entity )
{
    var index = this.entities.indexOf(entity);
    if( index > -1 )
    {
        this.entities.splice(index, 1);
        this.onEntityRemoved(entity);
    }
};

/**
* Check if given entity is present is the system.
* @param {ES.Entity} entity An ES.Entity instance.
* @return {boolean} True if entity is present, otherwise false.
*/
ES.System.prototype.isPresent = function( entity )
{
    return (this.entities.indexOf(entity) > -1);
};

/**
* Enable/disable the system.
* @param {boolean} value A boolean value.
*/
ES.System.prototype.setActif = function( value )
{
    this.enabled = value;
};

/**
* System's entry point.
* @param {number} deltaTime Time elasped since the last update.
*/
ES.System.prototype.update = function( deltaTime ) { };

/**
* Call when system is activated.
*/
ES.System.prototype.onActivation = function() { };

/**
* Call when system is inactivated.
*/
ES.System.prototype.onInactivation = function() { };

/**
* Call when an entity is added to the system.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.System.prototype.onEntityAdded = function( entity ) { };

/**
* Call when an entity is removed from the system.
* @param {ES.Entity} entity An ES.Entity instance.
*/
ES.System.prototype.onEntityRemoved = function( entity ) { };

/**
* Call when an event is send.
* @param {ES.Event} event An ES.Event instance.
*/
ES.System.prototype.onEvent = function( event ) { };
