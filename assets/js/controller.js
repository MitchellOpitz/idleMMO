let Controller = {

	recruit() {
		let hero = Hero.recruit();
		if ( hero ) {
        	View.updateText( "heroCost", "Next Hero: " + Hero.getHeroCost() );
			View.displayNewHero( hero );
		}
	}

}