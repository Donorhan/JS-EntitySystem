import {System} from '../../src/System.js'
import {DeadEvent} from '../Events/DeadEvent.js'

export class GameSystem extends System
{
    constructor()
    {
        super();
        this.continueGame = true;
    }

    update(deltaTime)
    {
        if (!this.continueGame)
        {
            // Draw end game pop-up, …
        }
    }

    onEvent(event) 
    {
        if (event instanceof DeadEvent)
            this.continueGame = false;
    }
}