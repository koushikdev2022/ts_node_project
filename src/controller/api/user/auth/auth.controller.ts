import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../../../config/db";
import { User } from "../../../../entities/User";

interface RegisterRequestBody {
    fullname: string;
    email: string;
    password: string;
}

export const register = async (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields",
                status: false,
                status_code: 400,
            });
        }

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                status: false,
                status_code: 400,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = userRepository.create({
            fullname,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_ACCESS_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "User registered successfully",
            status: true,
            status_code: 201,
            data: {
                id: user.id,
                name: user.fullname,
                email: user.email,
                token,
            },
        });
    } catch (error: any) {
        console.error("Error in register:", error);

        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({
            message,
            status: false,
            status_code: status,
        });
    }
};

export const list = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const users = await userRepository.find({
            where: { is_active: 1 },
        });

        return res.status(200).json({
            message: "Users found",
            status: true,
            status_code: 200,
            data: users,
        });
    } catch (error: any) {
        console.error("Error in list:", error);

        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({
            message,
            status: false,
            status_code: status,
        });
    }
};
