let View = {

	updateText( id, text ) {
		document.getElementById( id ).innerHTML = text;
	},

	displayNewHero( hero ) {

		let ID = "hero-" + hero.id;

	    // <section id="hero-[idNumber]">
	    let heroBlock = document.createElement("section");
	    heroBlock.setAttribute("id", ID );
	    heroBlock.setAttribute("class", "heroBlock" );
    	heroBlock.setAttribute("onclick", "Controller.activateHero(" + hero.id + ")");

	    	// <h3 id="hero-1-name">Name</h3>
	    	heroBlock.appendChild(
	    		View.createTagBlock( "h3", ID + "-name", hero.name )
	    		)

	    	// <p id="hero-1-level">Level: X</p>
	    	heroBlock.appendChild(
	    		View.createTagBlock( "p", ID + "-level", "Level: 1" )
	    		)

	    	// <p id="hero-1-level">Level: X</p>
	    	heroBlock.appendChild(
	    		View.createTagBlock( "p", ID + "-gearLevel", "Gear Level: 0" )
	    		)

	    var heroList = document.getElementById( "heroList" );
	    heroList.appendChild( heroBlock );

	},

	createTagBlock( tag, id, value ) {
		let tagBlock = document.createElement( tag );
		if ( id !== "" ) {
	    	tagBlock.setAttribute( "id", id );		
		}
	    tagBlock.innerHTML = value;
	    return tagBlock;
	},

	activateHero( hero ) {

			Game.activeHero = hero;
		// Active Hero Block
			View.updateText( "activeHero-name", hero.name );
			View.updateText( "activeHero-level", "Level: " + hero.level );
			View.updateText( "activeHero-gearLevel", "Gear Level: " + hero.gearLevel );
		    let element = document.getElementById( "activeHeroXPStatus" );
		    element.style.display = "block";

		// Upgrades Block			
			View.toggleUpgrades( "hero" );
			View.showHeroGear();
	},

	activateEnemy( enemy ) {
		View.updateText( "activeEnemy-name", enemy.name );
		View.updateText( "activeEnemy-health", "Health: " + enemy.health );
	    let element = document.getElementById( "activeEnemyHealthStatus" );
	    element.style.display = "block";
	},

	updateHeroExperienceBar( currentXP, hero ) {
	    let element = document.getElementById( "activeHeroExperienceBar" );
	    let numerator = currentXP - hero._xpToLevel( hero.level );
	    let denominator = hero._xpToLevel( hero.level + 1 ) - hero._xpToLevel( hero.level );
	    let width = ( numerator / denominator ) * 100;
	    element.style.width = width + "%";
	},

	updateEnemyHealthBar ( currentHealth, maxHealth ) {
	    let element = document.getElementById( "activeEnemyHealthBar" );
	    let width = ( currentHealth / maxHealth ) * 100;
	    element.style.width = width + "%";
	},

	toggleUpgrades( view ) {
		if ( view == "hero" ) {			
		    element = document.getElementById( "playerUpgrades" );
		    element.style.display = "none";
		    element = document.getElementById( "heroUpgrades" );
		    element.style.display = "flex";
		    element.style.justifyContent = "space-between";
		    View.showHeroGear();
		} else {			
		    element = document.getElementById( "heroUpgrades" );
		    element.style.display = "none";
		    element = document.getElementById( "playerUpgrades" );
		    element.style.display = "flex";
		    element.style.justifyContent = "space-between";
		}
	},

	showHeroGear() {
        let slots = [
        "Head",
        "Shoulders",
        "Chest",
        "Legs",
        "Belt",
        "Feet",
        "Hands",
        "Back",
        "Weapon"
        ];

		let items = Game.activeHero.items;

		for ( let i = 0; i < slots.length; i++ ) {
        	View.updateText( "activeHero-" + slots[i] + "-stats", "None" );
        	let element = document.getElementById( "activeHero-" + slots[i] );
        	element.style.border = ".5rem solid black";
        }

        for ( let i = 0; i < items.length; i++ ) {
        	let item = items[i];
        	let tag = "activeHero-" + item.slot;
        	console.log(tag);
        	let element = document.getElementById( tag );
        	View.updateText( tag + "-stats", item.rarity + " +" + item.stats );
        	switch( item.rarity ) {
        		case "Legendary":
        			element.style.border = ".5rem solid orange";
        			break;
        		case "Epic":
        			element.style.border = ".5rem solid purple";
        			break;
        		case "Rare":
        			element.style.border = ".5rem solid blue";
        			break;
        		case "Uncommon":
        			element.style.border = ".5rem solid green";
        			break;
        		case "Common":
        			element.style.border = ".5rem solid lightGrey";
        			break;
        		case "Broken":
        			element.style.border = ".5rem solid darkGrey";
        			break;
        	}
        }
	}

}