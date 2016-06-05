import {System} from '../../src/System.js'
import {DeadEvent} from '../Events/DeadEvent.js'
import {HealthComponent} from '../Components/HealthComponent.js'

export class LifeSystem extends System
{
    constructor()
    {
        super([HealthComponent]);
    }

    update(deltaTime)
    {
        for (let i = 0; i < this.entities.length; i++)
        {
            let healthComponent = this.entities[i].getComponent(HealthComponent);
            if (healthComponent && healthComponent.health <= 200)
                this.world.sendEvent(new DeadEvent(this.entities[i]));
        }
    }
}
