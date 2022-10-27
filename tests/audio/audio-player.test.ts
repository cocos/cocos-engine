import { resources } from '../../cocos/asset/asset-manager';
import {AudioClip, AudioPlayer, AudioState} from '../../cocos/audio/index';

// Test for boundary condition
test('audio player', function() {
    resources.load('', AudioClip, (err, clip) => {
        expect(err);
        expect(clip).toBeInstanceOf(undefined);
    });
    resources.load('effect', AudioClip, (err, clip)=>{
        expect(clip).toBeInstanceOf(AudioClip);

        var player = new AudioPlayer(clip);
        expect(player).toBeInstanceOf(AudioPlayer);
        expect(player.state).toBe(AudioState.READY);
        expect(player.currentTime).toBe(0);

        player.play();
        expect(player.state).toBe(AudioState.PLAYING);

        player.stop();
        expect(player.currentTime).toBe(0);
        player.destroy();

        var player2 = new AudioPlayer(err, {noWebAudio: true});
        expect(player2).toBeInstanceOf(AudioPlayer);
        expect(player2.state).toBe(AudioState.READY);
        expect(player2.currentTime).toBe(0);

        player2.play();
        expect(player2.state).toBe(AudioState.PLAYING);

        player2.stop();
        expect(player2.currentTime).toBe(0);
        player2.destroy();
    });
});
