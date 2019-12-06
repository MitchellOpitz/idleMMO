let Controller = {

	recruit() {
		let hero = Hero.recruit();
		if ( hero ) {
        	View.updateText( "heroCost", "Next Hero: " + Hero.getHeroCost() );
			View.displayNewHero( hero );
			let enemy = Enemy.spawn();

			let autoAttack = window.setInterval(function() {
                hero.attack( enemy );
            }, 1000 );
		}
	},

	activateHero( idNumber ) {
		let newHero = Game.getHero( idNumber - 1 );
		let newEnemy = Game.getEnemy( idNumber - 1);
		Game.setCurrentHero( newHero );
		Game.setCurrentEnemy( newEnemy );
		View.activateHero( newHero );
		View.activateEnemy( newEnemy );
	},

	assistHero() {
		let hero = Game.getCurrentHero();
		let enemy = Game.getEnemy( hero.id - 1 );
		hero.attack( enemy );
	}

}