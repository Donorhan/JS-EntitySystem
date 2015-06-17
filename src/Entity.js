goog.provide('ES.Entity');

/**
* An entity: A simple identifier with some shortcuts.
* @constructor
* @interface
* @param {ES.World} world A ES.World instance.
*/
ES.Entity = function( world )
{
    /**
    * Unique ID.
    * @type {number}
    */
    this.id = ES.Entity.prototype.nextID++;

    /**
    * A reference to the parent world.
    * @type {ES.World}
    */
    this.world = world;
}
ES.Entity.prototype.nextID = 0;

/**
* Add a component to the entity.
* @param {ES.Component} component The component instance to add.
*/
ES.Entity.prototype.addComponent = function( component )
{
    this.world.sendEvent( new ES.EntityEvent(this, ES.EntityEvent.Type.AddComponent, component) );
};

/**
* Remove a component.
* @param {ES.Component} component The component instance to remove.
*/
ES.Entity.prototype.removeComponent = function( component )
{
    this.world.sendEvent( new ES.EntityEvent(this, ES.EntityEvent.Type.RemoveComponent, component) );
};

/**
* Set name.
* @param {string} name A string representing the name to assign.
*/
ES.Entity.prototype.setName = function( name )
{
    this.world.setEntityName(name, this);
};

/**
* Get components.
* @return {Array.<ES.Component>}.
*/
ES.Entity.prototype.getComponents = function()
{
    return this.world.getComponents(this);
};

/**
* Get a component.
* @param {Object} component An ES.Component prototype.
* @return {ES.Component|null}.
*/
ES.Entity.prototype.getComponent = function( component )
{
    return this.world.getComponent(this, component);
};
