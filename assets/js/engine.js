let Game = {
  _heroList: [],
  _enemyList: [],
  _currentHero: "",
  _currentEnemy: "",
  _expansions: 0,

  // Getter Method
    get heroCount() {
      return this._heroList.length;
    },

    set activeHero( hero ) {
      this._currentHero = hero;
    },

    get activeHero() {
      return this._currentHero;
    },

    set activeEnemy( enemy ) {
      this._currentEnemy = enemy;
    },

    get activeEnemy() {
      return this._currentEnemy;
    },

    get levelCap() {
      return ( ( this._expansions * 10 ) + 20 );
    },

  // Methods
    addHero( hero ) {
      this._heroList.push( hero );
    },

    getHero( idNumber ) {
      return this._heroList[ idNumber ];
    },

    addEnemy( enemy ) {
      this._enemyList[ enemy.id - 1 ] = enemy;
    },

    getEnemy( idNumber ) {
      return this._enemyList[ idNumber ];
    },

    save() {
      localStorage.clear();
      localStorage.setItem( 'money', JSON.stringify( Money.total ) );
    },

    load() {
      // Money
      let moneySave = JSON.parse( localStorage.getItem( 'money' ) );
      Money.gainMoney( moneySave );
    }
}

let Money = {
  _currentTotal: 0,
  _htmlTag: "playerMoney",

  // Getter Methods
    get total() {
      return this._currentTotal;
    },

  // Public Methods
    gainMoney( amount ) {
      this._currentTotal += amount;
      Game.save();
      View.updateText( this._htmlTag, "Money: " + this._currentTotal );
    },

    spendMoney( amount ) {
      this._currentTotal -= amount;
      Game.save();
      View.updateText( this._htmlTag, "Money: " + this._currentTotal );
    },
}

class Hero {
  constructor () {
    this._idNumber = Game.heroCount + 1;
    this._name = "Hero #" + this._idNumber;
    this._level = 1;
    this._damage = 1;
    this._experience = 0;
    this._items = [];
    this._gearLevel = 0;
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

    static get cost() {
      return Game.heroCount * 2500;
    }

  // Public Methods
    static recruit() {

      if ( Money.total >= Hero.cost ) {
        Money.spendMoney( Hero.cost );
        let hero = new Hero();
        // Initialize any hero stats
        Game.addHero( hero );
        Game.save();
        return hero;
      } else {
        return false;
      }

    }

    attack( enemy ) {
      let damage = this._damage + this._gearLevel;

      // Damage formula
        // Effected by items and base damage.
      enemy.takeDamage( damage, this );
    }

    gainExperience( amount ) {
      if ( this._level < Game.levelCap ) {
        this._experience += amount;

        // Level-Up
        if ( this._experience >= this._xpToLevel( this._level + 1 ) ) {
          this._level++;

          // Update hero list.
          View.updateText( "hero-" + this.id + "-level", "Level: " + this.level );

          // Update active hero.
          if( this.id == Game.activeHero.id ) {
            View.updateText( "activeHero-level", "Level: " + this._level );
          }
          
        }

        Game.save();

      }

    }

    acquireItem( item ) {
        // START HERE
        let slot = item._slot;

        for ( let i = 0; i < this._items.length; i++ ) {
            if ( this._items[i]._slot == slot) {
                if ( item._stats > this._items[i]._stats ) {
                    this._items[i] = ( item );
                    this._gearLevel = this._updateGearLevel();
                    console.log( this._items );
                }
                return;
            }
        }

        this._items.push( item );
        this._gearLevel = this._updateGearLevel();
                    console.log( this._items );
    }

  // Private Methods
    _xpToLevel( level ) {
      return ( 2 * Math.pow( level, 3 ) );
    }

    _updateGearLevel() {
      // Calculate new gear level
      let level = 0;
      for ( let i = 0; i < this._items.length; i++ ) {
          level += this._items[i]._stats;
      }

      // Update text
      View.updateText( "hero-" + this.id + "-gearLevel", "Gear Level: " + level );
      if ( this._idNumber == Game.activeHero.id ) {  
          View.updateText( "activeHero-gearLevel", "Gear Level: " + level );                
      }
      return level;
    }

}

class Enemy {
  constructor () {
    this._idNumber = Game.heroCount;
    this._name = "Enemy #" + this._idNumber;
    this._level = Game.getHero( this._idNumber - 1 ).level;
    this._health = this._level*2 + this._level**2;
    this._goldDrop = this._level**2;
    this._experienceDrop = this._level*2;
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
      // Considered removing hero parameter.
      // Leaving because there could possibly be a counterattack feature.
      // In that case, would need to know who made the attack.
      this._health -= damage;
      if( this.id == Game.activeEnemy.id ) {
        View.updateText( "activeEnemy-health", "Health: " + this._health );
      }

      // Enemy slain
      if ( this._health <= 0 ) {
        Money.gainMoney( this._goldDrop );
        hero.gainExperience( this._experienceDrop );
        let item = Item.roll( this._level );
        if ( item ) {
          hero.acquireItem( item );
        }

        // Resets health.  For dev testing only.
        this._level = Game.getHero( this._idNumber - 1 ).level;
        this._health = this._level*2 + this._level**2;
        this._goldDrop = this._level**2;
        this._experienceDrop = this._level*2;
        if( this.id == Game.activeEnemy.id ) {
          View.updateText( "activeEnemy-health", "Health: " + this._health );
        }
      }
    }
}

class Item {
    constructor ()  {
        this._name;
        this._rarity;  // Done
        this._slot;  // Done
        this._class;
        this._stats;  // Done
        this._level;  // Done
        this._sellValue;
    }

    // Public Methods
        static roll( level ) {
            let roll = Math.random() * 100;
            roll = roll.toFixed( 3 );
            if ( roll > 99.99 ) {
                return Item.create( "Legendary", level );
            } else if ( roll > 99.9 ) {
                return Item.create( "Epic", level );
            } else if ( roll > 99 ) {
                return Item.create( "Rare", level );
            } else if ( roll > 97 ) {
                return Item.create( "Uncommon", level );
            } else if ( roll > 94 ) {
                return Item.create( "Common", level );
            } else if ( roll > 90 ) {
                return Item.create( "Broken", level );
            } else {
                return false;
            }
        }

        slotRoll() {
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
            ]
            let randomNumber = Math.floor( Math.random() * slots.length );
            this._slot = slots[randomNumber];
        }       

        getStats( rarity ) {
            switch( rarity ) {
                case "Legendary":
                    this._stats = Math.ceil( this._level * 1.5 );
                    console.log( "Gained Legendary item!");
                    break;
                case "Epic":
                    this._stats = this._level;
                    break;
                case "Rare":
                    this._stats = Math.ceil( this._level * .70 );
                    break;
                case "Uncommon":
                    this._stats = Math.ceil( this._level * .50 );
                    break;
                case "Common":
                    this._stats = Math.ceil( this._level * .40 );
                    break;
                case "Broken":
                    this._stats = Math.ceil( this._level * .25 );
                    break;
                }
        } 

        static create( rarity, level ) {
            let item = new Item;
            item._level = level;
            item._rarity = rarity;
            item.slotRoll();
            item.getStats( rarity );
            return item;
        }
}

Game.load();