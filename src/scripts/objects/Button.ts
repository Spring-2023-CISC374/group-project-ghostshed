export default class Button {

  public buttonInnerObj

  constructor(x: number, y: number, text: string, scene: Phaser.Scene, action: Function, fontSize: number = 12, padding: number = 15) {
      this.buttonInnerObj = scene.add.text(x, y, text)
          .setOrigin(0.5, 0.5) // Set the origin to be the middle of the button, halfway (0.5)
          .setPadding(padding)
          .setFontSize(fontSize)
          .setShadow(0.5)
          .setStyle({ 
            backgroundColor: '#852c09',
            color: '#000000',
            fontFamily: "CustomFont"
          })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', action)

      this.buttonInnerObj.on('pointerover', () => { this.handlePointerOver() })
      this.buttonInnerObj.on('pointerout', () => { this.handlePointerOut() })

  }

  protected handlePointerOver () {
    this.buttonInnerObj.setStyle({ 
      backgroundColor: '#712708',
      color: '#000000' 
    })
  }

  protected handlePointerOut () {
    this.buttonInnerObj.setStyle({ 
      backgroundColor: '#852c09',
      color: '#000000'
     })
  }

  public setVisible (visible: boolean) {
    this.buttonInnerObj.setVisible(visible)
  }
}
