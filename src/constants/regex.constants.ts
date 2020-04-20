// minimum reqs: 1 uppercase, 1 lowercase, 1 number, length >= 8
export const PASSWORD_REGEX: RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

export default {
    PASSWORD_REGEX
};