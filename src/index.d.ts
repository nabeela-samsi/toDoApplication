declare namespace Express{
    interface Request{
        user:{
            id: string,
            firstName: string,
            lastName: string,
            email: string,
            phoneNumber: number,
            extension: number,
            createdDate: date,
            modifiedDate: date,
            tasks: array
        },
        task:{
            id: string,
            name: string,
            description: string,
            createdDate: date,
            modifiedDate: date
        }
    }
}