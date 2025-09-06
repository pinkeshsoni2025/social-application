export class Follow {
    constructor(
        public _id: string,
        public user: string,
        public followed: string
    ) {}
}


export class Followed {
    constructor(
        public publications: any,
        public following: any,
        public followed: any
    ) {}
}