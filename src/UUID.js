/**
 * Utils functions
 *
 * @todo Set abstract, not supported by babel for now
 * @author Donovan ORHAN <dono.orhan@gmail.com>
 */
export class UUID
{
    /**
     * Get an identifier
     */
    static get(element)
    {
        let identifier = UUID.identifiers[element.name];
        if (!identifier)
        {
            identifier = 1 << UUID.nextID
            UUID.identifiers[element.name] = identifier;
            UUID.nextID++;
        }

        return identifier;
    }
}

/**
 * Components identifiers
 *
 * @type {number}
 */
UUID.identifiers = [];

/**
 * Used to identify next identifier available
 *
 * @type {number}
 */
UUID.nextID = 0;
