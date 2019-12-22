export default (req: any, res: any, next: Function) => {
    const header: String = req.headers.authorization || "";
    if(header.length === 0) {
        throw new Error("Invalid token");
    }
    const token: string = header.split(' ')[1].trim();
};