let Game = {
  _heroList: [],
  _enemyList: [],
  _currentHero: "",
  _currentEnemy: "",
  _expansions: 0,
  _maxHeroes: 25,

  // Getter Method
    get heroCount() {
      return this._heroList.length;
    },

    get maxHeroes() {
      return this._maxHeroes;
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

    get recommendedGearLevel() {
      return ( Game.levelCap * 191.25 );
      // levelCap * 9 gear slots * 25 heroes * .85 (85% epic'd)
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
      // localStorage.clear();
      let gameSave = [];
      gameSave.push( Money.total );
      //localStorage.setItem( 'money', JSON.stringify( Money.total ) );
      for ( let i = 0; i < Game.heroCount; i++ ) {
        let hero = Game.getHero(i);
        gameSave.push( hero );
      }
      localStorage.setItem( 'gameSave', JSON.stringify( gameSave ) );
    },

    load() {
      //localStorage.clear();
      let gameSave = JSON.parse( localStorage.getItem( 'gameSave' ) );

      if ( gameSave !== null ) {
        for ( let i = 1; i <= gameSave.length - 1; i++ ) {

          // Hero
          let hero = new Hero();
          let heroSave = gameSave[i];
          hero._id = heroSave._idNumber;
          hero._level = heroSave._level;
          hero._damage = heroSave._damage;
          hero._experience = heroSave._experience;
          let items = heroSave._items;
          hero._attackSpeed = heroSave._attackSpeed;
          View.displayNewHero( hero );
          View.updateText( "hero-" + hero.id + "-level", "Level: " + hero.level );
          View.activateHero( hero );
          //View.showHeroGear();
          Game.addHero( hero );

          // Items
          for ( let j = 0; j < items.length; j++ ) {
            let item = new Item();
            item._rarity = heroSave._items[j]._rarity;
            item._slot = heroSave._items[j]._slot;
            item._stats = heroSave._items[j]._stats;
            item._level = heroSave._items[j]._level;
            hero.acquireItem( item );
          }

          let enemy = Enemy.spawn();
          View.activateEnemy( enemy );
          hero.autoAttack( enemy );
        }
        // Money
        let moneySave = gameSave[0];
        Money.gainMoney( moneySave );
      }
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
    this._attackSpeed = 1000;
    this._autoAttack;
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

    get gearLevel() {
      return this._gearLevel;
    }

    get items() {
      return this._items;
    }

    get damage() {
      return this._damage;
    }

    get experience() {
      return this._experience;
    }

    get attackSpeed() {
      return this._attackSpeed;
    }

    static get cost() {
      return Game.heroCount * 2500;
    }

  // Public Methods
    static recruit() {

      if ( Game.heroCount == Game.maxHeroes ) {
        View.updateText( "heroCost", "Max Heroes Reached" );
        return false;
      }

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

    autoAttack( enemy ) {
      let hero = this;
      clearInterval( this._autoAttack );
      this._autoAttack = window.setInterval(function() {
        hero.attack( enemy );
      }, this._attackSpeed );
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

          // Update active hero.
          if( this.id == Game.activeHero.id ) {
            View.updateHeroExperienceBar( this._experience, this );
          }

        // Level-Up
        if ( this._experience >= this._xpToLevel( this._level + 1 ) ) {
          this._level++;

          // Update hero list.
          View.updateText( "hero-" + this.id + "-level", "Level: " + this.level );

          // Update active hero.
          if( this.id == Game.activeHero.id ) {
            View.updateText( "activeHero-level", "Level: " + this._level );
            View.updateHeroExperienceBar( this._experience, this );
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
                }
                return;
            }
        }

        this._items.push( item );
        this._gearLevel = this._updateGearLevel();
        View.showHeroGear();
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
          View.showHeroGear();            
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
    this._maxHealth = this._level*2 + this._level**2;
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
        View.updateEnemyHealthBar( this._health, this._maxHealth );
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
        this._maxHealth = this._level*2 + this._level**2;
        this._goldDrop = this._level**2;
        this._experienceDrop = this._level*2;
        if( this.id == Game.activeEnemy.id ) {
          View.updateText( "activeEnemy-health", "Health: " + this._health );
          View.updateEnemyHealthBar( this._health, this._maxHealth );
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

    // Getter Methods
      get slot() {
        return this._slot;
      }

      get rarity() {
        return this._rarity;
      }

      get stats() {
        return this._stats;
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

        static upgrade( slot, level ) {
        }
}

Game.load();