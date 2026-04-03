import { validationResult, check } from "express-validator";

export const validate = {
    register: [
        check('email')
            .notEmpty()
            .withMessage('email is required'),
        check("password")
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 8 })
            .withMessage('password must be 8 caracters'),
    ],
    Login: [
        check("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password must be 8 caracters"),
        check("email")
            .notEmpty()
            .withMessage("email is required"),
    ],
    Reset: [
        check("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password must be 8 caracters"),
        check("new_password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password must be 8 caracters"),
    ],
    forgetpassword: [
        check("email")
            .notEmpty()
            .withMessage("email is required"),
    ],
    ResetForgottenPassword: [
        check("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password must be 8 caracters"),
    ]
}

export const errorHandler = (req, res, next) => {

    const errors = validationResult(req); // Corrected to use validationResult
    if (!errors.isEmpty()) {
        const firsterror = errors.array()[0];
        return res.status(400).json({ error: firsterror.msg });
    }
    next(); // Proceed to the next middleware or route handler if no errors
};