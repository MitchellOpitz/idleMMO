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
	}

}