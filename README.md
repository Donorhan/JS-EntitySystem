JS - Entity System
======

An open source entity system in Javascript, what else?
Feel free to contribute :)

#### How to

An example is available in the folder "examples".

```javascript
 
// Create a world.
var world = new ES.World();

// Add systems.
world.addSystem( new DEMO.GameSystem() );
world.addSystem( new DEMO.LifeSystem() );
world.addSystem( new DEMO.PhysicSystem() );
world.addSystem( new DEMO.GraphicSystem() );

// Create a first entity.
{
    var entity = world.createEntity();
    entity.addComponent( new DEMO.HealthComponent(100) );
    entity.addComponent( new DEMO.PositionComponent( 2, 7 ) );
    entity.addComponent( new DEMO.SpriteComponent("picture.png") );
    entity.addComponent( new DEMO.VelocityComponent() );                   
}

// Create a second entity.
{
    var entity = world.createEntity();
    entity.addComponent( new DEMO.VelocityComponent() );
    entity.addComponent( new DEMO.PositionComponent(-2, -3) );
}

// Update the simulation. (In a real simulation, this part is inside a loop)
world.update(0.0);
 
```