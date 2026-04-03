import { check, validationResult } from "express-validator";

export const validator = {
    Idea: [
        check('title')
            .trim()
            .notEmpty()
            .withMessage('title is required'),
        check('description')
            .trim()
            .notEmpty()
            .withMessage('description is required'),
        check('category')
            .trim()
            .notEmpty()
            .withMessage('category is required'),
        check('skills')
            .trim()
            .notEmpty()
            .withMessage('skills is required'),
        check('team')
            .trim()
            .notEmpty()
            .withMessage('enter the people you might need'),
        check('status')
            .trim()
            .notEmpty()
            .withMessage('status is required'),
        check('budget')
            .trim()
            .notEmpty()
            .withMessage('budget is required'),
        check('maxNumber')
            .trim()
            .notEmpty()
            .withMessage('how many members for this project?')
    ],
    updateIdea: [
        check('title')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('title is required'),
        check('description')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('description is required'),
        check('category')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('category is required'),
        check('skills')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('skills is required'),
        check('team')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('enter the people you might need'),
        check('status')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('status is required'),
        check('budget')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('budget is required'),
        check('maxNumber')
            .if((value, { req }) => value !== undefined)
            .trim()
            .notEmpty()
            .withMessage('how many members for this project?')
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