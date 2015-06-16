'use strict';

/**
* An EntityEvent.
*
* @param {ES.Entity} entity An Entity instance.
* @param {ES.EntityEvent.Type} type An ES.EntityEvent.Type instance.
* @param {ES.Component} component A Component instance.
* @augments ES.Event
* @constructor
*/
ES.EntityEvent = function( entity, type, component )
{
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
    this.component  = component;
}
ES.Utils.extend(ES.Event, ES.EntityEvent);

/**
* EntityEvent's types.
*/
ES.EntityEvent.Type = { AddComponent: 0, RemoveComponent: 1 };