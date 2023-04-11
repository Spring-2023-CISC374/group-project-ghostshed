export default class Button {

  public buttonInnerObj

  constructor(x: number, y: number, text: string, scene: Phaser.Scene, action: Function) {
      this.buttonInnerObj = scene.add.text(x, y, text)
          .setOrigin(0.5, 0.5) // Set the origin to be the middle of the button, halfway (0.5)
          .setPadding(20)
          .setFontSize(20)
          .setStyle({ 
            backgroundColor: '#7CDAF7',
            color: '#000000'
          })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', action)

      this.buttonInnerObj.on('pointerover', () => { this.handlePointerOver() })
      this.buttonInnerObj.on('pointerout', () => { this.handlePointerOut() })

  }

  protected handlePointerOver () {
    this.buttonInnerObj.setStyle({ 
      backgroundColor: '#49CBF2',
      color: '#000000' 
    })
  }

  protected handlePointerOut () {
    this.buttonInnerObj.setStyle({ 
      backgroundColor: '#7CDAF7',
      color: '#000000'
     })
  }
}
