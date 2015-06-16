'use strict';

DEMO.LifeSystem = function()
{
    ES.System.call(this, [DEMO.HealthComponent]);
}
ES.Utils.extend(ES.System, DEMO.LifeSystem);

DEMO.LifeSystem.prototype.update = function( deltaTime )
{
	for( var i = 0; i < this.entities.length; i++ )
	{
		var healthComponent = this.entities[i].getComponent(DEMO.HealthComponent);
		if( healthComponent && healthComponent.health <= 200 )
			this.world.sendEvent( new DEMO.DeadEvent(this.entities[i]) );
	}
};