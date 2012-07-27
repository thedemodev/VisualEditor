/**
 * VisualEditor user interface Menu class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * Creates an ve.ui.Menu object.
 *
 * @class
 * @constructor
 * @param {Object[]} items List of items to append initially
 * @param {Function} callback Function to call if an item doesn't have its own callback
 * @param {jQuery} [$overlay=$( 'body' )] DOM selection to add nodes to
 */
ve.ui.Menu = function ( items, callback, $overlay ) {
	var i, menu;

	// Properties
	this.$ = $( '<div class="es-menuView"></div>' ).appendTo( $overlay || $( 'body' ) );
	this.items = [];
	this.autoNamedBreaks = 0;
	this.callback = callback;

	// Items
	if ( ve.isArray( items ) ) {
		for ( i = 0; i < items.length; i++ ) {
			this.addItem( items[i] );
		}
	}

	// Events
	menu = this;
	menu.$.on( {
		'mousedown': function ( e ) {
			if ( e.which === 1 ) {
				e.preventDefault();
				return false;
			}
		},
		'mouseup': function ( e ) {
			if ( e.which === 1 ) {
				var name, i,
					$item = $( e.target ).closest( '.es-menuView-item' );
				if ( $item.length ) {
					name = $item.attr( 'rel' );
					for ( i = 0; i < menu.items.length; i++ ) {
						if ( menu.items[i].name === name ) {
							menu.onSelect( menu.items[i], e );
							return true;
						}
					}
				}
			}
		}
	} );
};

/* Methods */

ve.ui.Menu.prototype.addItem = function ( item, before ) {
	if ( item === '-' ) {
		item = {
			'name': 'break-' + this.autoNamedBreaks++
		};
	}
	// Items that don't have custom DOM elements will be auto-created
	if ( !item.$ ) {
		if ( !item.name ) {
			throw 'Invalid menu item error. Items must have a name property.';
		}
		if ( item.label ) {
			item.$ = $( '<div class="es-menuView-item"></div>' )
				.attr( 'rel', item.name )
				// TODO: this should take a labelmsg instead and call ve.msg()
				.append( $( '<span>' ).text( item.label ) );
		} else {
			// No label, must be a break
			item.$ = $( '<div class="es-menuView-break"></div>' )
				.attr( 'rel', item.name );
		}
		// TODO: Keyboard shortcut (and icons for them), support for keyboard accelerators, etc.
	}
	if ( before ) {
		for ( var i = 0; i < this.items.length; i++ ) {
			if ( this.items[i].name === before ) {
				this.items.splice( i, 0, item );
				this.items[i].$.before( item.$ );
				return;
			}
		}
	}
	this.items.push( item );
	this.$.append( item.$ );
};

ve.ui.Menu.prototype.removeItem = function ( name ) {
	for ( var i = 0; i < this.items.length; i++ ) {
		if ( this.items[i].name === name ) {
			this.items.splice( i, 1 );
			i--;
		}
	}
};

ve.ui.Menu.prototype.getItems = function () {
	return this.items;
};

ve.ui.Menu.prototype.setPosition = function ( position ) {
	return this.$.css( {
		'top': position.top,
		'left': position.left
	} );
};

ve.ui.Menu.prototype.open = function () {
	this.$.show();
};

ve.ui.Menu.prototype.close = function () {
	this.$.hide();
};

ve.ui.Menu.prototype.isOpen = function () {
	return this.$.is( ':visible' );
};

ve.ui.Menu.prototype.onSelect = function ( item, event ) {
	if ( typeof item.callback === 'function' ) {
		item.callback( item );
	} else if ( typeof this.callback === 'function' ) {
		this.callback( item );
	}
	this.close();
};
