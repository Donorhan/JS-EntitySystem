import {System} from '../../src/System.js'
import {PositionComponent} from '../Components/PositionComponent.js'
import {VelocityComponent} from '../Components/VelocityComponent.js'

export class PhysicSystem extends System
{
    constructor()
    {
        super([VelocityComponent, PositionComponent]);
        this.physicEngine = null;
    }

    update(deltaTime)
    {
        // Manage physic simulation
    }

    onEntityAdded(entity)
    {
        if (!this.physicEngine)
            return;

        let body = this.physicEngine.createBody();

        let position = entity.getComponent(PositionComponent);
        body.setPosition(position.x, position.y);

        let velocity = entity.getComponent(VelocityComponent);
        body.setVelocity(velocity.x, velocity.y);
    }
}
