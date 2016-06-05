import {System} from '../../src/System.js'
import {PositionComponent} from '../Components/PositionComponent.js'
import {SpriteComponent} from '../Components/SpriteComponent.js'

export class GraphicSystem extends System
{
    constructor()
    {
        super([SpriteComponent, PositionComponent]);
    }

    update(deltaTime)
    {
        // Draw scene using SpriteComponent
    }
}