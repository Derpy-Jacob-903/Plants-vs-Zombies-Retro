
//Clase Box
function Box (game, xPos, yPos, _boardRef){
    Phaser.Button.apply(this,[game, xPos, yPos, 'frame', this.onInputUp]);
    this.game.world.addChild(this);
    this.scale.setTo(0.5);
    this.alpha = 0.3;
  
    this.plantPlaced = false;
  
    this.boardRef = _boardRef;
  
    this.x = xPos;
    this.y = yPos;
  
    this.inputEnabled = false;
    this.onInputOver.add(this.over, this);
    this.onInputOut.add(this.out, this);
    this.onInputUp.add(this.up, this);
    this.onInputDown.add(this.down,this);
  }
  Box.prototype = Object.create(Phaser.Button.prototype);
  Box.constructor = Box;
  //Metodos
  Box.prototype.up = function(){
    console.log("casilla clickada");
    if(this.boardRef.selectedPlant != null)
      this.plant();
    else if (this.boardRef.selectedPlant == null){
      this.clearBox();
    }
  }
  Box.prototype.down = function(){
    this.scale.setTo(0.37);
  }
  Box.prototype.over = function(){
    if(!this.plantPlaced)
      this.scale.setTo(0.42);
  }
  Box.prototype.out = function(){
    this.scale.setTo(0.5);
  }
  Box.prototype.clearBox = function (){
    if(this.plantPlaced){
      //Busca la planta y la borra
      var plant = this.boardRef.searchPlant(this.x, this.y);
      //Eliminado
      var index = this.boardRef.plants.indexOf(plant);
      plant.destroy();
      this.boardRef.plants.splice(index, 1);
      //Deja libre esta caja
      this.plantPlaced = false;
    }
    else if (!this.plantPlaced){
      //Desactivas modo pala
      this.boardRef.spManager.shovel.deselectShovel();
    }
  }
  Box.prototype.plant = function(){
    this.game.cursor.clearCursor();
  
    if(this.plantPlaced){
      console.log('lugar ya plantado');
  
      this.boardRef.disableBoard();
      this.boardRef.selectedPlant = null;
  
      this.boardRef.spManager.cardSelector.deSelectAll();
    } else if(!this.plantPlaced && this.boardRef.selectedPlant != null){
      console.log('Planta plantada');
  
      //Habra que retocar para que dependiendo de la planta use un sprite u otro
      var plantType = this.boardRef.selectedPlant;
  
      this.boardRef.plants.push(new plantType(this.game, this.x, this.y, this.boardRef));    
      this.plantPlaced = true;
  
      this.boardRef.selectedPlant = null;
      this.boardRef.disableBoard();
      this.boardRef.spManager.cardSelector.deSelectAll();
  
      //Al crearse debe quitar el coste 
      this.boardRef.spManager.sunCounter.points -= plantType.cost;
      this.boardRef.spManager.sunCounter.updateCounter();
  
    } else{
      console.log('Accion anulada');
      
      this.boardRef.disableBoard();
      this.boardRef.selectedPlant = null;
  
      this.boardRef.spManager.cardSelector.deSelectAll();
    }
    this.scale.setTo(0.5);
  }