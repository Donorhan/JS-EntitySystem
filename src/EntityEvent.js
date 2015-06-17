goog.provide('ES.EntityEvent');
goog.require('ES.Event');
goog.require('ES.Utils');

/**
* An EntityEvent.
*
* @param {ES.Entity} entity An Entity instance.
* @param {ES.EntityEvent.Type} type An ES.EntityEvent.Type instance.
* @param {ES.Component} component A Component instance.
* @extends {ES.Event}
* @constructor
*/
ES.EntityEvent = function( entity, type, component )
{
    goog.base(this);

    /**
    * The target.
    * @type {ES.Entity}
    */
    this.entity = entity;

    /**
    * Entity's event type.
    * @type {ES.EntityEvent.Type}
    */
    this.type = type;

    /**
    * Targted Component.
    * @type {ES.Component}
    */
    this.component = component;
}
goog.inherits( ES.EntityEvent, ES.Event );

/**
* EntityEvent's types.
* @enum {number}
*/
ES.EntityEvent.Type = { AddComponent: 0, RemoveComponent: 1 };