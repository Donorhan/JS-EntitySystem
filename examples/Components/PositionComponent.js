'use strict';

/**
* Add a position to the entities.
* @constructor
*/
DEMO.PositionComponent = function( x, y )
{
    ES.Component.call(this);
    this.x = x;
    this.y = y;
}
ES.Utils.extend(ES.Component, DEMO.PositionComponent);
