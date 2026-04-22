import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';

function App()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [sceneName, setSceneName] = useState('Loading');

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setSceneName(scene.scene.key);
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div className="sceneInfo">
                <h1>Mario-like movement prototype</h1>
                <p>Active scene: {sceneName}</p>
                <p>Use the left and right arrow keys to move the character.</p>
            </div>
        </div>
    )
}

export default App
