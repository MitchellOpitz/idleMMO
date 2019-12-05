let Game = {
  _heroList: [],

  // Methods
    getHeroCount() {
      return this._heroList.length;
    },

    addHero( hero ) {
      this._heroList.push( hero );
      // console.log( this._heroList );
    },
}

let Money = {
  _currentTotal: 50000,
  _htmlTag: "playerMoney",

  // Methods
  gainMoney( amount ) {
    this._currentTotal += amount;
    View.updateText( this._htmlTag, "Money: " + this._currentTotal );
  },

  spendMoney( amount ) {
    this._currentTotal -= amount;
    View.updateText( this._htmlTag, "Money: " + this._currentTotal );
  },

  getTotal() {
    return this._currentTotal;
  },
}

class Hero {
  constructor () {
    this._idNumber = Game.getHeroCount() + 1;
    this._name = "Hero #" + this._idNumber;
    this._level = 1;
  }

  // Getter Methods
  get name() {
    return this._name;
  }

  get id() {
    return this._idNumber;
  }

  get level() {
    return this._level;
  }

  // Public Methods
    static getHeroCost() {
      return Game.getHeroCount() * 2500;
    }

    static recruit() {

      if ( Money.getTotal() >= Hero.getHeroCost() ) {
        Money.spendMoney( Hero.getHeroCost() );
        let hero = new Hero();
        // Initialize any hero stats
        Game.addHero( hero );
        return hero;
      } else {
        return false;
      }

    }

}