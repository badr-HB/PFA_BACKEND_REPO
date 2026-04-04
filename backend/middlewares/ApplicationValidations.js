import { validationResult, check } from "express-validator";

export const validate = {
    report: [
        check('report')
            .trim()
            .notEmpty()
            .withMessage('type the reason for reporting that user')
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