'use strict';

/**
* Utils functions.
* @constructor
*/
ES.Utils = function() { }
ES.Utils.nextID = 0;

/**
* System's entry point.
* @param {Object} parent Parent class to inherit from.
* @param {Object} child Child: The target.
*/
ES.Utils.extend = function( parent, child )
{
    child.prototype             = Object.create(parent.prototype);      // Inherit.
    child.prototype.constructor = child;                                // Repair the inherited constructor.
    child.prototype.UID         = 1 << ES.Utils.nextID;                 // Compute UID.
    ES.Utils.nextID++;
};
