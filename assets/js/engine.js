let Money = {
  _currentTotal: 0,
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
}