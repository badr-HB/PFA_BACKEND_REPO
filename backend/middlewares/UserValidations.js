import { validationResult, check } from "express-validator";

export const validator = {
    profile: [
        check("name")
            .trim()
            .notEmpty()
            .withMessage('name is required'),
        check("skills")
            .trim()
            .notEmpty()
            .withMessage('atleast enter one skill')
            .isArray({ max: 5 })
            .withMessage('max 5 skills'),
        check("available")
            .trim()
            .notEmpty()
            .withMessage('available is required'),
        check("country")
            .trim()
            .notEmpty()
            .withMessage('country is required'),
        check("bio")
            .trim()
            .notEmpty()
            .withMessage('bio is required')
            .isLength({ max: 150 })
            .withMessage('bio has reached its length limit')
    ],
    updateprofile: [
        check("name")
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('name is required'),
        check("skills")
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('atleast enter one skill')
            .isArray({ max: 5 })
            .withMessage('max 5 skills'),
        check("available")
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('available is required'),
        check("country")
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('country is required'),
        check("bio")
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('bio is required')
            .isLength({ max: 150 })
            .withMessage('bio has reached its length limit')
    ],
}


export const errorHandler = (req, res, next) => {

    const errors = validationResult(req); // Corrected to use validationResult
    if (!errors.isEmpty()) {
        const firsterror = errors.array()[0];
        return res.status(400).json({ error: firsterror.msg });
    }
    next(); // Proceed to the next middleware or route handler if no errors
};