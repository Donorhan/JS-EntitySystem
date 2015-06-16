'use strict';

DEMO.HealthComponent = function( health )
{
    ES.Component.call(this);
    this.health = health;
}
ES.Utils.extend(ES.Component, DEMO.HealthComponent);