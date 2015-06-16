'use strict';

DEMO.SpriteComponent = function( image )
{
    ES.Component.call(this);
    this.image = image;
}
ES.Utils.extend(ES.Component, DEMO.SpriteComponent);
