import { useState } from "react";
import { createRoot } from "react-dom/client"
import { createHighlighter } from 'shiki'
import { ShikiMagicMovePrecompiled } from "../src/react";
import { createMagicMoveMachine } from "../src/core";
import { codeToKeyedTokens } from "../src/core";
import '../src/style.css'

const highlighter = await createHighlighter({
    themes: ["vitesse-light"],
    langs: ["tsx"],
})

const machine = createMagicMoveMachine(
    code => codeToKeyedTokens(highlighter, code, {
        lang: "tsx",
        theme: "vitesse-light",
    })
)

const compiledCode = [
`function greet() {
    console.log('Hello, World!');
}

greet();`,
`const name = 'Alice';

function greet() {
    console.log('Hello, ' + name + '!');
}

greet();`
].map(code => machine.commit(code).current)


const CodePage: React.FC = () => {
    const [step, setStep] = useState(0)

    return <>
        <ShikiMagicMovePrecompiled
            steps={compiledCode}
            step={step}
            animate={true}
            options={{ duration: 750, stagger: 7, lineNumbers: true }}
        />
        <button onClick={() => setStep(step === 1 ? 0 : 1)}>Animate</button>
    </>
}

createRoot(document.getElementById('app')!).render(<CodePage/>)
