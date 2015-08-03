goog.provide('ES.Utils');

/**
* Utils functions.
* @constructor
*/
ES.Utils = function() { }
ES.Utils.nextID = 0;

/**
* System's entry point.
* @param {Function} parent Parent class to inherit from.
* @param {Function} child Child: The target.
*/
ES.Utils.extend = function( parent, child )
{
	goog.inherits( child, parent );
    child.prototype.UID = 1 << ES.Utils.nextID;
    ES.Utils.nextID++;
};
