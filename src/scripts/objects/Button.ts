export default class Button {

  public buttonInnerObj

  constructor(x: number, y: number, text: string, scene: Phaser.Scene, action: Function) {
      this.buttonInnerObj = scene.add.text(x, y, text)
          .setOrigin(0.5, 0.5) // Set the origin to be the middle of the button, halfway (0.5)
          .setPadding(20)
          .setFontSize(25)
          .setStyle({ backgroundColor: '#111' })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', action)

      this.buttonInnerObj.on('pointerover', () => { this.handlePointerOver() })
      this.buttonInnerObj.on('pointerout', () => { this.handlePointerOut() })

  }

  protected handlePointerOver () {
    this.buttonInnerObj.setStyle({ fill: '#f39c12' })
  }

  protected handlePointerOut () {
    this.buttonInnerObj.setStyle({ fill: '#FFF' })
  }
}
