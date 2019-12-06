let Game = {
  _heroList: [],
  _enemyList: [],
  _currentHero: "",
  _currentEnemy: "",

  // Methods
    getHeroCount() {
      return this._heroList.length;
    },

    addHero( hero ) {
      this._heroList.push( hero );
    },

    addEnemy( enemy ) {
      this._enemyList[ enemy.id - 1 ] = enemy;
    },

    getHero( idNumber ) {
      return this._heroList[ idNumber ];
    },

    getEnemy( idNumber ) {
      return this._enemyList[ idNumber ];
    },

    setCurrentHero( hero ) {
      this._currentHero = hero;
    },

    getCurrentHero() {
      return this._currentHero;
    },

    setCurrentEnemy( enemy ) {
      this._currentEnemy = enemy;
    },

    getCurrentEnemy() {
      return this._currentEnemy;
    }
}

let Money = {
  _currentTotal: 500000,
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
    this._damage = 5;
    this._experience = 0;
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

    attack( enemy ) {
      // Damage formula
        // Effected by items and base damage.
      enemy.takeDamage( this._damage, this );
    }

    gainExperience( amount ) {
      this._experience += amount;

      // Level-Up
      if ( this._experience >= this._xpToLevel( this._level + 1 ) ) {
        this._level++;
        View.updateText( "hero-" + this.id + "-level", "Level: " + this.level );
        let currentHero = Game.getCurrentHero();
        if( this.id == currentHero.id ) {
          View.updateText( "activeHero-level", "Level: " + this._level );
        }
      }
    }

  // Private Methods
    _xpToLevel( level ) {
      return ( 2 * Math.pow( level, 3 ) );
    }

}

class Enemy {
  constructor () {
    this._idNumber = Game.getHeroCount();
    this._name = "Enemy #" + this._idNumber;
    this._health = 10;
    this._goldDrop = 5;
    this._experienceDrop = 25;
  }

  // Getter Methods
    get id() {
      return this._idNumber;
    }
    get name() {
      return this._name;
    }
    get health() {
      return this._health;
    }

  // Public Methods
    static spawn() {
      let enemy = new Enemy();
      // Initialize any enemy stats
      Game.addEnemy( enemy );
      return enemy;
    }

    takeDamage( damage, hero ) {
      this._health -= damage;
      let currentEnemy = Game.getCurrentEnemy();
      if( this.id == currentEnemy.id ) {
        View.updateText( "activeEnemy-health", "Health: " + this._health );
      }

      // Enemy slain
      if ( this._health <= 0 ) {
        Money.gainMoney( this._goldDrop );
        hero.gainExperience( this._experienceDrop );

        // Resets health.  For dev testing only.
        this._health = 10;
        let currentEnemy = Game.getCurrentEnemy();
        if( this.id == currentEnemy.id ) {
          View.updateText( "activeEnemy-health", "Health: " + this._health );
        }
      }
    }
}