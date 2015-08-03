'use strict';

DEMO.PhysicSystem = function()
{
    ES.System.call(this, [DEMO.PositionComponent, DEMO.VelocityComponent]);
    this.physicEngine = null;
}
ES.Utils.extend(ES.System, DEMO.PhysicSystem);

DEMO.PhysicSystem.prototype.update = function( deltaTime )
{   	
	// Manage physic simulation.
};

DEMO.PhysicSystem.prototype.onEntityAdded = function( entity )
{
	if( this.physicEngine )
	{
		var body = this.physicEngine.createBody();

		var position = entity.getComponent(DEMO.PositionComponent);
		body.setPosition(position.x, position.y);

		var velocity = entity.getComponent(DEMO.VelocityComponent);
		body.setVelocity(velocity.x, velocity.y);
	}
};
