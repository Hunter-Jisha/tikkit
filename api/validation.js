import joi from "joi"

export default
{
    user: joi.object(
        {
            firstname: joi.string()
            .alphanum()
            .min(2)
            .max(16),
            lastname: joi.string()
            .alphanum()
            .min(2)
            .max(16),
            email: joi.string()
            .email(),
            password: joi.string()
            .min(6)
            .max(16)
        }
    )
}