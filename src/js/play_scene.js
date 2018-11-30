'use strict';

  var PlayScene = {
  create: function () {
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);
    // logo.scale.setTo(0.7);

    this.game.stage.backgroundColor = '#ffffff'

    this.bulletPool = [];
    this.sunPool = [];
    
    //Zombie en Pantalla
    this.zombie = new Zombie(this.game, 800, 300-100, "zombies", 1, 30, 1);
    this.zombie.scale.setTo(1.8); 

    this.spManager = new SPManager(this.game, this.bulletPool, this.sunPool, 4);
    
    //Cursor Changer
    this.game.cursor = new MouseChanger(this.game, 0, 0, undefined);
  },
  
  update: function (){

    //Update de los Zombies
    this.zombie.updateZombie();

    //Update de las Plantas
    for(let i =0;i<this.spManager.board.plants.length;i++)
      this.spManager.board.plants[i].shoot(this.bulletPool);

    //Update de las Bullets
    for(let i = 0; i < this.bulletPool.length; i++)
      this.bulletPool[i].move();;

    //Update de SPManager
    this.spManager.updateSPM();

    //Temporal (se comprobará cada zombie con cada planta de su fila)
    //Colision de Bullets con Zombies
    for(let i = 0; i < this.bulletPool.length; i++)      
      this.game.physics.arcade.collide(this.bulletPool[i],this.zombie,function bulletCollision(obj1,obj2) {    
        obj2.takeDamage(obj1._dam);
        obj1.Oncollision();
    });

    //Temporal (se comprobará cada zombie con cada planta de su fila)
    //Colision de Zombies con Plants
    for(let i = 0; i < this.spManager.board.plants.length; i++)
      this.game.physics.arcade.collide(this.zombie, this.spManager.board.plants[i], function zombieAttackPlant(obj1,obj2) { 
        if(obj1.x > obj2.x + obj1.width / 2) {
          var dam = obj1.attack();
          var obj2IsDead = obj2.takeDamage(dam);
          obj1.isAttacking = !obj2IsDead;}
    });
  },
  render: function (){
    //this.game.cursor.move();
  }
};

module.exports = PlayScene;
