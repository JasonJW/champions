﻿var CoC = CoC || {};
CoC.model = CoC.model || {};

(function(){

  //championStarRankValue[stars][rank]
  var championStarRankLevels={
    1:{
      1:{ levels: 10, min:100, max:175 }, 
      2:{ levels: 20, min:175, max:250 },
      ranks: 2
    },
    2:{
      1:{ levels: 10, min:150, max:250 }, 
      2:{ levels: 20, min:250, max:400 }, 
      3:{ levels: 30, min:400, max:600 },
      ranks: 3
    },
    3:{
      1:{ levels: 10, min:300, max:500 }, 
      2:{ levels: 20, min:500, max:900 }, 
      3:{ levels: 30, min:900, max:1200 }, 
      4:{ levels: 40, min:1200, max:1500 },
      ranks: 4
    },
    4:{
      1:{ levels: 10, min:750, max:1000 }, 
      2:{ levels: 20, min:1000, max:1750 }, 
      3:{ levels: 30, min:1750, max:2500 }, 
      4:{ levels: 40, min:2500, max:3500 }, 
      5:{ levels: 50, min:3500, max:4500 },
      ranks: 5
    }
    //TODO: 5-star values
  }

  CoC.model.Champion = Backbone.Model.extend({
    defaults: {
      uid: "champion",
      stars:2,
      name: 'Champion',
      typeId: "mutant",
      awakened: 0,
      rank: 1,
      level: 1,
      grade: 0,
      gradeAwakened: 0,
      quest: false
    },
    
    pi:function(){
      var stars = this.get("stars"), rank = this.get("rank"), level = this.get("level");
      if(level < 1 || championStarRankLevels[stars] === undefined)
        return 0;
      var range = championStarRankLevels[stars][rank];
      if(range === undefined || level > range.levels )
        return 0;
      return range.min + (this.get("level") / range.levels) * (range.max - range.min);
    },
    
    ranks:function(){
      var stars = championStarRankLevels[this.get("stars")];
      if(stars === undefined)
        return null;
      return stars.ranks;
    },
    
    levels:function(){
      var stars = championStarRankLevels[this.get("stars")];
      if(stars === undefined)
        return null;
      var rank = stars[this.get("rank")];
      if(rank === undefined)
        return null;
      return rank.levels;
    },
    
    stars:function(){
      if(this._stars === undefined){
        this._stars = ["", "★", "★★", "★★★", "★★★★", "★★★★★"][this.get("stars")];
      }
      return this._stars;
    },
    
    fid:function(){
      if(this._fid === undefined){
        this._fid = this.get("uid")+"_"+this.get("stars");
      }
      return this._fid;
    },
    
    portrait:function(){
      if(this._portrait === undefined){
        this._portrait = 'images/champions/portrait_'+this.get('uid')+'.png'
      }
      return this._portrait;
    },
    
    image:function(){
      if(this._image === undefined){
        this._image = 'images/champions/fullsize_'+this.get('uid')+'.png'
      }
      return this._image;
    },
    
    type:function(){
      if(this._type === undefined){
        this._type = CoC.data.types.findWhere({ uid:this.get("typeId") });
      }
      return this._type;
    },
    
    crystals:function(){
      if(this._crystals === undefined){
        this._crystals = [];
        var ccs = CoC.data.crystalChampions.find({ championId:this.get("uid"), championStars:this.get("stars") });
        for(var i=0; i<ccs.length; i++)
          this._crystals.push(ccs.crystal())
      }
      return this._crystals;
    },
    
    //dirty way to migrate to new data model using uid/stars as given
    update:function(){
      var other = CoC.data.champions.findWhere({ uid:this.get("uid"), stars:this.get("stars") });
      if(!other)
        return false;
      this.set("name", other.get("name"));
      this.set("typeId", other.get("typeId"));
      this.set("stars", parseInt(this.get("stars"), 10));
      this.set("rank", parseInt(this.get("rank"), 10));
      this.set("level", parseInt(this.get("level"), 10));
      return true;
    }
  });
  
})();