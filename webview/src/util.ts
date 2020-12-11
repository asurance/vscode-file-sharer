// export function throttle<T extends unknown[]>(fn: (...argv: T) => void, interval: number): (...argv: T) => void {
//     let argvs: T
//     let id: number | null = null
//     let last = 0
//     console.log('interval')
//     return function (...argv: T): void {
//         argvs = argv
//         if (id === null) {
//             const now = Date.now()
//             if (last + interval > now) {
//                 console.log(last + interval - now)
//                 id = window.setTimeout(() => {
//                     id = null
//                     last = Date.now()
//                     fn(...argvs)
//                 }, last + interval - now)
//             } else {
//                 last = now
//                 fn(...argvs)
//             }
//         }
//     }
// }

export function debounce<T extends unknown[]>(fn: (...argv: T) => void, interval: number): (...argv: T) => void {
    let id: number | null = null
    return function (...argv: T): void {
        if (id !== null) {
            window.clearTimeout(id)
        }
        id = window.setTimeout(() => {
            id = null
            fn(...argv)
        }, interval)
    }
}