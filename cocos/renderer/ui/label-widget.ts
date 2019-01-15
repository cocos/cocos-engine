import { UI } from './ui';
import { UIWidget, UIWidgetType } from './ui-widget';

export class LabelWidget extends UIWidget {

    constructor (ui: UI) {
        super(ui, UIWidgetType.LABEL);
    }

    public update () {

    }
}
