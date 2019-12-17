let Controller = {

	recruit() {
		let hero = Hero.recruit();
		if ( hero ) {
        	View.updateText( "heroCost", "Next Hero: " + Hero.cost );
			View.displayNewHero( hero );
			let enemy = Enemy.spawn();

			// Activate first hero.
			if ( Game.heroCount == 1 ) {
				Controller.activateHero( hero.id );
			}

			hero.autoAttack( enemy );
		}
	},

	activateHero( idNumber ) {
		let newHero = Game.getHero( idNumber - 1 );
		Game.activeHero = newHero ;
		View.activateHero( newHero );
		
		let newEnemy = Game.getEnemy( idNumber - 1);
		Game.activeEnemy = newEnemy ;
		View.activateEnemy( newEnemy );

	},

	assistHero() {
		let hero = Game.activeHero;
		let enemy = Game.getEnemy( hero.id - 1 );
		hero.attack( enemy );
	},

	upgradeGear( slot ) {
		let hero = Game.activeHero;
		let newItem;
		let itemCost;

		// If no items equipped.
		if ( hero.items.length == 0 ) {
			newItem = [];
			while ( newItem.slot !== slot ) {
				newItem = Item.create( "Broken", hero.level );
			}
		} else {
			for ( let i = 0; i < hero.items.length; i++ ) {
				// Get the item currently in slot.
				let item = hero.items[i];

				if ( item.slot == slot ) {
					console.log( "Item exists in slot!" );

					// Set initial values.
					let stats = item.stats;
					let rarities = [ "Broken", "Common", "Uncommon", "Rare", "Epic", "Legendary" ];

					// Check for next upgrade.
					for ( let j = 0; j < rarities.length; j++ ) {
						newItem = [];
						// Create an item of the same slot, rarity, and level.
						while ( newItem.slot !== slot ) {
							newItem = Item.create( rarities[j], hero.level );
						}
						if ( newItem.stats > stats ) {
							console.log( "New item better than old: " + newItem.stats + " | " + stats );
							break;
						}
						if (rarities[j] == "Legendary" ) {
							console.log( "No upgrade available." );
							return;
						}
					}
					break;
				}

				if ( i == hero.items.length - 1 && (item.slot !== slot) ) {
						console.log( "Last item does not match slot." );
						newItem = [];
						// Create an item of the same slot, rarity, and level.
						while ( newItem.slot !== slot ) {
							newItem = Item.create( "Broken", hero.level );
						}	
				}
			}
		}

		// Get the item cost.
		switch( newItem.rarity ) {
    		case "Legendary":
    			itemCost = hero.level * 10000;
    			break;
    		case "Epic":
    			itemCost = hero.level * 1000;
    			break;
    		case "Rare":
    			itemCost = hero.level * 100;
    			break;
    		case "Uncommon":
    			itemCost = hero.level * 10;
    			break;
    		case "Common":
    			itemCost = hero.level * 5;
    			break;
    		case "Broken":
    			itemCost = hero.level * 2 ;
    			break;
    	}

    	if ( itemCost <= Money.total ) {
	    	Money.spendMoney( itemCost );
			hero.acquireItem( newItem );    		
    	}
	}

}