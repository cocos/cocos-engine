import { Node } from "../../../cocos/core";
import { InstantiatedSubRegionPlayer } from "../../../cocos/core/animation/subregion/subregion";
import { Subregion } from "../../../editor/exports/subregion";

export class SubRegionHostMock {
    constructor(private _root: Node, private _subregion: Subregion) {
        const instantiatedPlayer = this._subregion.player.instantiate(_root);
        this._instantiatedPlayer = instantiatedPlayer;
    }

    get wellInstantiated() {
        return !!this._instantiatedPlayer;
    }

    public play(time: number) {
        this._instantiatedPlayer.play(time);
    }

    public stop(time: number) {
        this._instantiatedPlayer.stop(time);
    }

    public setSpeed(speed: number) {
        this._instantiatedPlayer.setSpeed(speed);
    }

    private _instantiatedPlayer: InstantiatedSubRegionPlayer | null;
}