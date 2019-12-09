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

			// This needs to become the hero's responsibility.
			let autoAttack = window.setInterval(function() {
                hero.attack( enemy );
            }, 1000 );
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
	}

}