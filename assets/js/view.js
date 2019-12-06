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
		View.updateText( "activeHero-name", hero.name );
		View.updateText( "activeHero-level", "Level: " + hero.level );
	},

	activateEnemy( enemy ) {
		View.updateText( "activeEnemy-name", enemy.name );
		View.updateText( "activeEnemy-health", "Level: " + enemy.health );
	}

}