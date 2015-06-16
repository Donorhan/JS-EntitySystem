'use strict';

DEMO.GraphicSystem = function()
{
    ES.System.call(this, [DEMO.SpriteComponent, DEMO.PositionComponent]);
}
ES.Utils.extend(ES.System, DEMO.GraphicSystem);

DEMO.GraphicSystem.prototype.update = function( deltaTime )
{
	// Draw scene using DEMO.SpriteComponent
};