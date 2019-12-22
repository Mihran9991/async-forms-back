import UserService from "../services/user.service";

export async function getAllRouter(req: any, res: any, userService: UserService) {
    userService.findAll()
        .catch(err => {
            res.status(400).json({ error: err })
        })
        .then(users => 
            res.status(200).json({ users }));
}

export default { getAllRouter };