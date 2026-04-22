import { useRef, useState } from 'react';
import { APP_HELP_TEXT, APP_TITLE } from './appCopy';
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
                <h1>{APP_TITLE}</h1>
                <p>Active scene: {sceneName}</p>
                <p>{APP_HELP_TEXT}</p>
            </div>
        </div>
    )
}

export default App
