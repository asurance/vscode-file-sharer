export class PromiseObject<T>{
    private data: T | Promise<T>
    constructor(data: Promise<T>) {
        this.data = data
        data.then(d => this.data = d)
    }
    async getData(): Promise<T> {
        if (this.data instanceof Promise) {
            return await this.data
        } else {
            return this.data
        }
    }
}