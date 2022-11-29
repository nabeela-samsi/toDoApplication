class APIError{
    constructor(public code: number, public message: string) {
        this.code = code
        this.message = message
    }

    static badRequest(errorMsg:string) {
        return new APIError(400,errorMsg)
    }

    static notFound(errorMsg:string) {
        return new APIError(404,errorMsg)
    }

    static internalServerError(errorMsg:string){
        return new APIError(500,errorMsg)
    }
}

export default APIError