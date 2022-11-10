@CustomDialog
export struct EditBoxDialog {
  private showMessage: string = ''
  private inputMessage: string = ''
  onTextChange: (msg: string) => void
  accept: (msg: string) => void
  controller: CustomDialogController
  cancel: () => void
  confirm: () => void

  build() {
    Column() {
      Row() {
        TextInput({ text: this.showMessage })
          .backgroundColor('#ffffff')
          .layoutWeight(1)
          .onChange((value) => {
            if (this.onTextChange) {
              this.onTextChange(value);
            }
            this.inputMessage = value;
          })
        Blank(8).width(16)
        Button('完成').onClick(() => {
          if (this.accept) {
            this.accept(this.inputMessage);
          }
          this.controller.close();
        })
      }.padding({ left: 8, right: 8, top: 8, bottom: 8 })
      .backgroundColor(Color.Gray)

    }
    .width('100%')

    .justifyContent(FlexAlign.End)
  }
}
