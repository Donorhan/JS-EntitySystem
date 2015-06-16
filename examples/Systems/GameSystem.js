'use strict';

DEMO.GameSystem = function()
{
    ES.System.call(this);
    this.continueGame = true;
}
ES.Utils.extend(ES.System, DEMO.GameSystem);

DEMO.GameSystem.prototype.update = function( deltaTime )
{
	// Manage simulation.
	if( !this.continueGame )
	{
		// Draw end game pop-up, …
	}
};

/**
* Call when an event is received from the world.
* @param {ES.Event} event An ES.Event instance.
*/
DEMO.GameSystem.prototype.onEvent = function( event ) 
{
	if( event instanceof DEMO.DeadEvent )
		this.continueGame = false;
};
