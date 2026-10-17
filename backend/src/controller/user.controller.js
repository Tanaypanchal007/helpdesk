const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const createUser = async (req, res) => {

    try {
        const { name, email, password, role, isActive } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password is required!"
            });
        }

        if (password.length < 10) {
            return res.status(400).json({
                message: "Password must be at least 10 characters long."
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userData = await userModel.create({
            name, email, password: hashPassword
        });

        res.status(201).json({
            message: "User register Successfully!",
            userData
        });

    } catch (error) {
        console.log(error);
    }

}



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }


        const userExists = await userModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!userExists) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }


        if (!userExists.isActive) {
            return res.status(403).json({
                message: "Your account is inactive."
            });
        }


        const isPasswordCorrect = await bcrypt.compare(
            password,
            userExists.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        const token = jwt.sign(
            { userId: userExists.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        )

        return res.status(200).json({
            message: "User login successful!",
            token,
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                role: userExists.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};


module.exports = { createUser, loginUser };