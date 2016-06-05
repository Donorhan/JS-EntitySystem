import {World} from '../src/World.js'
import {GameSystem} from './Systems/GameSystem.js'
import {LifeSystem} from './Systems/LifeSystem.js'
import {PhysicSystem} from './Systems/PhysicSystem.js'
import {GraphicSystem} from './Systems/GraphicSystem.js'
import {HealthComponent} from './Components/HealthComponent.js'
import {PositionComponent} from './Components/PositionComponent.js'
import {SpriteComponent} from './Components/SpriteComponent.js'
import {VelocityComponent} from './Components/VelocityComponent.js'

class Main
{
    constructor()
    {
        // Create a world
        let world = new World();

        // Add systems
        world.addSystem(new GameSystem());
        world.addSystem(new LifeSystem());
        world.addSystem(new PhysicSystem());
        world.addSystem(new GraphicSystem());

        // Create a first entity
        {
            let entity = world.createEntity();
            entity.addComponent(new HealthComponent(100));
            entity.addComponent(new PositionComponent(2, 7));
            entity.addComponent(new SpriteComponent("picture.png"));
            entity.addComponent(new VelocityComponent());                 
        }

        // Create a second entity
        {
            let entity = world.createEntity();
            entity.addComponent(new VelocityComponent());
            entity.addComponent(new PositionComponent(-2, -3));
        }

        // Update simulation
        world.update(0.0);
    }
}

// Here we go
let main = new Main();