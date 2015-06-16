'use strict';

/**
* A DeadEvent: occured when an entity die (HealthComponent under or equal to 0).
*
* @param {ES.Entity} entity An Entity instance.
* @augments ES.Event
* @constructor
*/
DEMO.DeadEvent = function( entity )
{
    /**
    * The target.
    * @type {ES.Entity}
    */
    this.entity = entity;
}
ES.Utils.extend(ES.Event, DEMO.DeadEvent);