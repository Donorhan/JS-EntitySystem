import {ESEvent} from '../../src/ESEvent.js'

/**
 * A DeadEvent: occured when an entity die (HealthComponent under or equal to 0)
 *
 * @param {Entity} entity An Entity instance.
 * @augments ES.Event
 * @constructor
 */
export class DeadEvent extends ESEvent
{
    constructor(entity)
    {
        super();
        this.entity = entity;
    }
}