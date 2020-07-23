window.acquireVsCodeApi = (): VSCode<State> => {
    return {
        getState(): undefined {
            return undefined
        },
        setState(): void {
            // none
        },
        postMessage(): void {
            // none
        }
    }
}
import('./index')